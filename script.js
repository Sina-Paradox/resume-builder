// script.js
// This file contains all the logic for the live resume preview and PDF generation.

// 1. WAIT FOR THE PAGE TO FULLY LOAD
// This ensures all HTML elements exist before our script tries to use them.
document.addEventListener('DOMContentLoaded', function() {

    // 2. GET THE MAIN ELEMENTS WE NEED
    const resumeForm = document.getElementById('resume-form');
    const resumeToExport = document.getElementById('resume-to-export');
    const downloadButton = document.getElementById('download-pdf');
    const templateButtons = document.querySelectorAll('.template-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    const dynamicStylesheet = document.getElementById('resume-template');

    // 3. DEFINE THE RESUME STRUCTURE
    // This function creates the HTML skeleton for the resume inside the preview.
    // We call this once at the start to initialize the preview.
    function initializeResumeStructure() {
        resumeToExport.innerHTML = `
            <!-- HEADER: Name & Contact Info -->
            <div class="resume-header">
                <h1 class="resume-name" id="preview-name">Your Full Name</h1>
                <p class="resume-contact" id="preview-email">email@example.com</p>
                <p class="resume-contact" id="preview-phone">(123) 456-7890</p>
                <p class="resume-contact" id="preview-location">City, Country</p>
                <p class="resume-contact" id="preview-linkedin">linkedin.com/in/yourprofile</p>
            </div>

            <!-- PROFESSIONAL SUMMARY SECTION -->
            <div class="resume-section">
                <h2 class="section-title">Professional Summary</h2>
                <p id="preview-summary">A motivated and passionate professional with skills in...</p>
            </div>

            <!-- WORK EXPERIENCE SECTION -->
            <div class="resume-section">
                <h2 class="section-title">Work Experience</h2>
                <div id="preview-experience">
                    <!-- JavaScript will add experience items here later -->
                    <p>Your work experience will appear here.</p>
                </div>
            </div>

            <!-- EDUCATION SECTION -->
            <div class="resume-section">
                <h2 class="section-title">Education</h2>
                <div id="preview-education">
                    <!-- JavaScript will add education items here later -->
                    <p>Your education history will appear here.</p>
                </div>
            </div>

            <!-- SKILLS SECTION -->
            <div class="resume-section">
                <h2 class="section-title">Skills</h2>
                <ul class="resume-list" id="preview-skills">
                    <!-- JavaScript will add skills here later -->
                    <li>Your skills will appear here.</li>
                </ul>
            </div>
        `;
        // Note: We've only included the essential sections here for now.
        // We can add more (Projects, Certifications, Languages) using the same pattern.
    }

    // 4. CALL THE FUNCTION TO SET UP THE RESUME SKELETON
    initializeResumeStructure();

    // 5. LIVE PREVIEW FUNCTION
    // This function connects an input field to a preview element.
    function connectField(inputId, previewId, defaultValue, isHTML = false) {
        const inputElement = document.getElementById(inputId);
        const previewElement = document.getElementById(previewId);

        // Check if both elements exist before trying to use them
        if (inputElement && previewElement) {
            inputElement.addEventListener('input', function() {
                if (this.value.trim() === '') {
                    // If the input is empty, show the default placeholder text
                    previewElement.textContent = defaultValue;
                    if(isHTML) previewElement.innerHTML = defaultValue;
                } else {
                    // Otherwise, show the user's input
                    if (isHTML) {
                        // Use innerHTML for fields that might need formatting (like lists)
                        previewElement.innerHTML = this.value;
                    } else {
                        // Use textContent for safety (prevents HTML injection)
                        previewElement.textContent = this.value;
                    }
                }
            });
        }
    }

    // 6. CONNECT ALL THE BASIC FIELDS
    // Usage: connectField('input-id', 'preview-id', 'Default Placeholder Text')
    connectField('input-name', 'preview-name', 'Your Full Name');
    connectField('input-email', 'preview-email', 'email@example.com');
    connectField('input-phone', 'preview-phone', '(123) 456-7890');
    connectField('input-location', 'preview-location', 'City, Country');
    connectField('input-linkedin', 'preview-linkedin', 'linkedin.com/in/yourprofile');
    connectField('input-summary', 'preview-summary', 'A motivated and passionate professional with skills in...');

    // 7. SPECIAL HANDLING FOR SKILLS (ARRAY -> LIST)
    const skillsInput = document.getElementById('input-skills');
    const skillsPreview = document.getElementById('preview-skills');
    if(skillsInput && skillsPreview) {
        skillsInput.addEventListener('input', function() {
            const skillsArray = this.value.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
            // skillsArray is now a list of skills, e.g., ['Python', 'Project Management']

            if (skillsArray.length === 0) {
                skillsPreview.innerHTML = '<li>Your skills will appear here.</li>';
            } else {
                // Clear the current list
                skillsPreview.innerHTML = '';
                // Add a new list item for each skill
                skillsArray.forEach(skill => {
                    const li = document.createElement('li');
                    li.textContent = skill;
                    skillsPreview.appendChild(li);
                });
            }
        });
    }

    // 8. DYNAMIC WORK EXPERIENCE LOGIC

    // Get references to the experience container and add button
    const experienceContainer = document.getElementById('experience-container');
    const addExperienceButton = document.getElementById('add-experience');
    const experiencePreview = document.getElementById('preview-experience');

    // Template for an empty experience form
    function getExperienceFormHTML() {
        return `
            <div class="dynamic-item">
                <button type="button" class="remove-btn">×</button>
                
                <label>Job Title</label>
                <input type="text" class="exp-job-title" placeholder="e.g., Software Engineer">
                
                <label>Company Name</label>
                <input type="text" class="exp-company" placeholder="e.g., Tech Solutions Inc.">
                
                <label>Location (City, Country)</label>
                <input type="text" class="exp-location" placeholder="e.g., San Francisco, USA">
                
                <div style="display: flex; gap: 1rem;">
                    <div style="flex: 1;">
                        <label>Start Date</label>
                        <input type="month" class="exp-start-date">
                    </div>
                    <div style="flex: 1;">
                        <label>End Date</label>
                        <input type="month" class="exp-end-date">
                    </div>
                </div>
                
                <label>Description & Responsibilities (one per line)</label>
                <textarea class="exp-description" rows="3" placeholder="• Managed a team of developers...&#10;• Implemented new features..."></textarea>
            </div>
        `;
    }

    // Template for how an experience will look in the preview
    function getExperiencePreviewHTML(experience = {}) {
        // Use empty strings as defaults if data doesn't exist yet
        const { jobTitle = '', company = '', location = '', startDate = '', endDate = '', description = '' } = experience;
        
        // Split the description by new lines to create bullet points
        const descriptionPoints = description ? description.split('\n').filter(point => point.trim() !== '') : [];
        
        return `
            <div class="experience-item">
                <div class="item-header">
                    <span>${jobTitle || 'Job Title'}</span>
                    <span>${formatDateRange(startDate, endDate)}</span>
                </div>
                <div class="item-subheader">
                    <span>${company || 'Company Name'}</span>
                    <span>${location || 'Location'}</span>
                </div>
                <ul class="resume-list">
                    ${descriptionPoints.map(point => `<li>${point.replace('•', '').trim()}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // Helper function to format dates as "MMM YYYY - MMM YYYY" or "Present"
    function formatDateRange(startDate, endDate) {
        if (!startDate) return '';
        
        const formatDate = (dateString) => {
            if (!dateString) return 'Present';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        };
        
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }

    // Function to update the experience preview section
    function updateExperiencePreview() {
        // Get all experience forms
        const experienceForms = experienceContainer.querySelectorAll('.dynamic-item');
        const experiencesData = [];
        
        // Extract data from each form
        experienceForms.forEach(form => {
            experiencesData.push({
                jobTitle: form.querySelector('.exp-job-title').value,
                company: form.querySelector('.exp-company').value,
                location: form.querySelector('.exp-location').value,
                startDate: form.querySelector('.exp-start-date').value,
                endDate: form.querySelector('.exp-end-date').value,
                description: form.querySelector('.exp-description').value
            });
        });
        
        // Update the preview
        if (experiencesData.length === 0) {
            experiencePreview.innerHTML = '<p>Your work experience will appear here.</p>';
        } else {
            experiencePreview.innerHTML = experiencesData.map(exp => getExperiencePreviewHTML(exp)).join('');
        }
    }

    // Function to add a new experience form
    function addExperienceForm() {
        const newForm = document.createElement('div');
        newForm.innerHTML = getExperienceFormHTML();
        experienceContainer.appendChild(newForm);
        
        // Add event listener to the remove button
        const removeBtn = newForm.querySelector('.remove-btn');
        removeBtn.addEventListener('click', function() {
            newForm.remove();
            updateExperiencePreview(); // Update preview after removal
        });
        
        // Add input listeners to all fields in this new form
        const inputs = newForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', updateExperiencePreview);
        });
        
        // Initialize the preview for this new form
        updateExperiencePreview();
    }

    // Add event listener to the "Add Experience" button
    if (addExperienceButton) {
        addExperienceButton.addEventListener('click', addExperienceForm);
    }

    // 9. INITIALIZE WITH ONE EMPTY EXPERIENCE FORM
    // This gives users a starting point when they load the page
    addExperienceForm();

        // 10. DYNAMIC EDUCATION LOGIC (follows the same pattern as Experience)

    // Get references to the education container and add button
    const educationContainer = document.getElementById('education-container');
    const addEducationButton = document.getElementById('add-education');
    const educationPreview = document.getElementById('preview-education');

    // Template for an empty education form
    function getEducationFormHTML() {
        return `
            <div class="dynamic-item">
                <button type="button" class="remove-btn">×</button>
                
                <label>Degree or Certification</label>
                <input type="text" class="edu-degree" placeholder="e.g., Bachelor of Science in Computer Science">
                
                <label>Institution Name</label>
                <input type="text" class="edu-institution" placeholder="e.g., University of Technology">
                
                <label>Location (City, Country)</label>
                <input type="text" class="edu-location" placeholder="e.g., New York, USA">
                
                <div style="display: flex; gap: 1rem;">
                    <div style="flex: 1;">
                        <label>Start Date</label>
                        <input type="month" class="edu-start-date">
                    </div>
                    <div style="flex: 1;">
                        <label>End Date (or Expected)</label>
                        <input type="month" class="edu-end-date">
                    </div>
                </div>
                
                <label>Relevant Coursework or Achievements (optional, one per line)</label>
                <textarea class="edu-description" rows="2" placeholder="• Dean's List&#10;• Relevant Project..."></textarea>
            </div>
        `;
    }

    // Template for how education will look in the preview
    function getEducationPreviewHTML(education = {}) {
        // Use empty strings as defaults if data doesn't exist yet
        const { degree = '', institution = '', location = '', startDate = '', endDate = '', description = '' } = education;
        
        // Split the description by new lines to create bullet points
        const descriptionPoints = description ? description.split('\n').filter(point => point.trim() !== '') : [];
        
        return `
            <div class="education-item">
                <div class="item-header">
                    <span>${degree || 'Degree/Certification'}</span>
                    <span>${formatDateRange(startDate, endDate)}</span>
                </div>
                <div class="item-subheader">
                    <span>${institution || 'Institution Name'}</span>
                    <span>${location || 'Location'}</span>
                </div>
                ${descriptionPoints.length > 0 ? `
                    <ul class="resume-list">
                        ${descriptionPoints.map(point => `<li>${point.replace('•', '').trim()}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
    }

    // Function to update the education preview section
    function updateEducationPreview() {
        // Get all education forms
        const educationForms = educationContainer.querySelectorAll('.dynamic-item');
        const educationData = [];
        
        // Extract data from each form
        educationForms.forEach(form => {
            educationData.push({
                degree: form.querySelector('.edu-degree').value,
                institution: form.querySelector('.edu-institution').value,
                location: form.querySelector('.edu-location').value,
                startDate: form.querySelector('.edu-start-date').value,
                endDate: form.querySelector('.edu-end-date').value,
                description: form.querySelector('.edu-description').value
            });
        });
        
        // Update the preview
        if (educationData.length === 0) {
            educationPreview.innerHTML = '<p>Your education history will appear here.</p>';
        } else {
            educationPreview.innerHTML = educationData.map(edu => getEducationPreviewHTML(edu)).join('');
        }
    }

    // Function to add a new education form
    function addEducationForm() {
        const newForm = document.createElement('div');
        newForm.innerHTML = getEducationFormHTML();
        educationContainer.appendChild(newForm);
        
        // Add event listener to the remove button
        const removeBtn = newForm.querySelector('.remove-btn');
        removeBtn.addEventListener('click', function() {
            newForm.remove();
            updateEducationPreview(); // Update preview after removal
        });
        
        // Add input listeners to all fields in this new form
        const inputs = newForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', updateEducationPreview);
        });
        
        // Initialize the preview for this new form
        updateEducationPreview();
    }

    // Add event listener to the "Add Education" button
    if (addEducationButton) {
        addEducationButton.addEventListener('click', addEducationForm);
    }

    // 11. INITIALIZE WITH ONE EMPTY EDUCATION FORM
    addEducationForm();

    // 12. PDF DOWNLOAD FUNCTIONALITY
    // Add event listener to the download button
    if (downloadButton) {
        downloadButton.addEventListener('click', generatePDF);
    }

    // Function to generate and download the PDF
    function generatePDF() {
        const originalText = downloadButton.textContent;
        downloadButton.textContent = 'Generating PDF...';
        downloadButton.disabled = true;

        const element = document.getElementById('resume-to-export');
        
        const opt = {
            margin: 10,
            filename: `${document.getElementById('input-name').value.trim() || 'my'}-resume.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait'
            }
        };

        html2pdf()
            .set(opt)
            .from(element)
            .save()
            .then(() => {
                console.log('PDF generated successfully!');
                showSuccessMessage();
            })
            .catch(error => {
                console.error('PDF generation failed:', error);
                alert('Sorry, there was an error generating your PDF. Please try again.');
            })
            .finally(() => {
                downloadButton.textContent = originalText;
                downloadButton.disabled = false;
            });
    }
    
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'download-success';
        message.textContent = '✅ PDF downloaded successfully!';
        document.body.appendChild(message);
        
        // Remove the message after animation completes
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    // 13. DYNAMIC FILENAME BASED ON USER'S NAME
    // Let's improve the PDF filename to use the person's name if available
    function updatePDFFilename() {
        const name = document.getElementById('input-name').value.trim();
        if (name) {
            // Create a filename-friendly version of the name
            const cleanName = name.toLowerCase().replace(/\s+/g, '-');
            // Update the download button text to show personalization
            downloadButton.textContent = `Download ${name.split(' ')[0]}'s Resume PDF`;
        } else {
            downloadButton.textContent = 'Download PDF';
        }
    }

    // Listen for name changes to update the download button text
    const nameInput = document.getElementById('input-name');
    if (nameInput) {
        nameInput.addEventListener('input', updatePDFFilename);
    }

    // Initialize the download button text
    updatePDFFilename();

        // 14. TEMPLATE SWITCHING FUNCTIONALITY

    // Function to switch templates
    function switchTemplate(templateName) {
        // Show loading overlay
        loadingOverlay.classList.remove('loading-hidden');
        
        // Update the active button state
        templateButtons.forEach(btn => {
            if (btn.dataset.template === templateName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Create a new link element for the new template
        const newTemplateLink = document.createElement('link');
        newTemplateLink.rel = 'stylesheet';
        newTemplateLink.id = 'resume-template';
        newTemplateLink.href = `templates/${templateName}.css`;
        
        // When the new template loads, remove the old one and hide loading
        newTemplateLink.onload = function() {
            // Remove the old stylesheet
            const oldTemplate = document.getElementById('resume-template');
            if (oldTemplate && oldTemplate.parentNode) {
                oldTemplate.parentNode.removeChild(oldTemplate);
            }
            
            // Update the ID of the new stylesheet
            newTemplateLink.id = 'resume-template';
            
            // Hide loading overlay
            loadingOverlay.classList.add('loading-hidden');
        };
        
        // Add the new template to the document head
        document.head.appendChild(newTemplateLink);
    }

    // Add event listeners to template buttons
    templateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const templateName = this.dataset.template;
            switchTemplate(templateName);
        });
    });

    // 15. CREATE BASIC TEMPLATE FILES
    // Since we only have template-1.css, let's create minimal versions of the other templates
    // Users can customize these later

    // Note: We'll create template-2.css to template-5.css with basic variations
    // For now, they can just be copies of template-1.css with different colors

    // More event listeners will be added here for email, summary, etc.

    // ... (We will add code for template switching and PDF download here next)

});