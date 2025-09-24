document.addEventListener('DOMContentLoaded', function() {

    const resumeForm = document.getElementById('resume-form');
    const resumeToExport = document.getElementById('resume-to-export');
    const downloadButton = document.getElementById('download-pdf');
    const templateButtons = document.querySelectorAll('.template-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    const dynamicStylesheet = document.getElementById('resume-template');

    function initializeResumeStructure() {
        resumeToExport.innerHTML = `
            <div class="resume-header">
                <h1 class="resume-name" id="preview-name">Your Full Name</h1>
                <p class="resume-contact" id="preview-email">email@example.com</p>
                <p class="resume-contact" id="preview-phone">(123) 456-7890</p>
                <p class="resume-contact" id="preview-location">City, Country</p>
                <p class="resume-contact" id="preview-linkedin">linkedin.com/in/yourprofile</p>
            </div>

            <div class="resume-section">
                <h2 class="section-title">Professional Summary</h2>
                <p id="preview-summary">A motivated and passionate professional with skills in...</p>
            </div>

            <div class="resume-section">
                <h2 class="section-title">Work Experience</h2>
                <div id="preview-experience">
                    <p>Your work experience will appear here.</p>
                </div>
            </div>

            <div class="resume-section">
                <h2 class="section-title">Education</h2>
                <div id="preview-education">
                    <p>Your education history will appear here.</p>
                </div>
            </div>

            <div class="resume-section">
                <h2 class="section-title">Skills</h2>
                <ul class="resume-list" id="preview-skills">
                    <li>Your skills will appear here.</li>
                </ul>
            </div>
        `;
    }

    initializeResumeStructure();

    function connectField(inputId, previewId, defaultValue, isHTML = false) {
        const inputElement = document.getElementById(inputId);
        const previewElement = document.getElementById(previewId);

        if (inputElement && previewElement) {
            inputElement.addEventListener('input', function() {
                if (this.value.trim() === '') {
                    previewElement.textContent = defaultValue;
                    if(isHTML) previewElement.innerHTML = defaultValue;
                } else {
                    if (isHTML) {
                        previewElement.innerHTML = this.value;
                    } else {
                        previewElement.textContent = this.value;
                    }
                }
            });
        }
    }

    connectField('input-name', 'preview-name', 'Your Full Name');
    connectField('input-email', 'preview-email', 'email@example.com');
    connectField('input-phone', 'preview-phone', '(123) 456-7890');
    connectField('input-location', 'preview-location', 'City, Country');
    connectField('input-linkedin', 'preview-linkedin', 'linkedin.com/in/yourprofile');
    connectField('input-summary', 'preview-summary', 'A motivated and passionate professional with skills in...');

    const skillInput = document.getElementById('skill-input');
    const addSkillButton = document.getElementById('add-skill');
    const skillsTagsContainer = document.getElementById('skills-tags-container');
    const skillsPreview = document.getElementById('preview-skills');
    
    let skillsArray = [];
    
    function addSkill() {
        const skill = skillInput.value.trim();
        if (skill && !skillsArray.includes(skill)) {
            skillsArray.push(skill);
            updateSkillsTags();
            updateSkillsPreview();
            skillInput.value = '';
        }
    }
    
    function removeSkill(skillToRemove) {
        skillsArray = skillsArray.filter(skill => skill !== skillToRemove);
        updateSkillsTags();
        updateSkillsPreview();
    }
    
    function updateSkillsTags() {
        skillsTagsContainer.innerHTML = '';
        skillsArray.forEach(skill => {
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                ${skill}
                <button type="button" class="remove-skill">×</button>
            `;
            tag.querySelector('.remove-skill').addEventListener('click', () => removeSkill(skill));
            skillsTagsContainer.appendChild(tag);
        });
    }
    
    function updateSkillsPreview() {
        skillsPreview.innerHTML = '';
        skillsArray.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill;
            skillsPreview.appendChild(li);
        });
    }
    
    addSkillButton.addEventListener('click', addSkill);
    skillInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addSkill();
    });


    const experienceContainer = document.getElementById('experience-container');
    const addExperienceButton = document.getElementById('add-experience');
    const experiencePreview = document.getElementById('preview-experience');

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

    function getExperiencePreviewHTML(experience = {}) {
        const { jobTitle = '', company = '', location = '', startDate = '', endDate = '', description = '' } = experience;
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

    function formatDateRange(startDate, endDate) {
        if (!startDate) return '';
        
        const formatDate = (dateString) => {
            if (!dateString) return 'Present';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        };
        
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }

    function updateExperiencePreview() {
        const experienceForms = experienceContainer.querySelectorAll('.dynamic-item');
        const experiencesData = [];
        
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
        
        const experienceSection = document.querySelector('.resume-section:nth-child(3)');
        
        if (experiencesData.length === 0) {
            experienceSection.style.display = 'none';
        } else {
            experienceSection.style.display = 'block';
            experiencePreview.innerHTML = experiencesData.map(exp => getExperiencePreviewHTML(exp)).join('');
        }
    }

    function addExperienceForm() {
        const newForm = document.createElement('div');
        newForm.innerHTML = getExperienceFormHTML();
        experienceContainer.appendChild(newForm);
        
        const removeBtn = newForm.querySelector('.remove-btn');
        removeBtn.addEventListener('click', function() {
            newForm.remove();
            updateExperiencePreview();
        });
        
        const inputs = newForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', updateExperiencePreview);
        });
        
        updateExperiencePreview();
    }

    if (addExperienceButton) {
        addExperienceButton.addEventListener('click', addExperienceForm);
    }

    addExperienceForm();


    const educationContainer = document.getElementById('education-container');
    const addEducationButton = document.getElementById('add-education');
    const educationPreview = document.getElementById('preview-education');

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

    function getEducationPreviewHTML(education = {}) {
        const { degree = '', institution = '', location = '', startDate = '', endDate = '', description = '' } = education;
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

    function updateEducationPreview() {
        const educationForms = educationContainer.querySelectorAll('.dynamic-item');
        const educationData = [];
        
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
        
        const educationSection = document.querySelector('.resume-section:nth-child(4)');
        
        if (educationData.length === 0) {
            educationSection.style.display = 'none';
        } else {
            educationSection.style.display = 'block';
            educationPreview.innerHTML = educationData.map(edu => getEducationPreviewHTML(edu)).join('');
        }
    }

    function addEducationForm() {
        const newForm = document.createElement('div');
        newForm.innerHTML = getEducationFormHTML();
        educationContainer.appendChild(newForm);
        
        const removeBtn = newForm.querySelector('.remove-btn');
        removeBtn.addEventListener('click', function() {
            newForm.remove();
            updateEducationPreview();
        });
        
        const inputs = newForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', updateEducationPreview);
        });
        
        updateEducationPreview();
    }

    if (addEducationButton) {
        addEducationButton.addEventListener('click', addEducationForm);
    }

    addEducationForm();

    if (downloadButton) {
        downloadButton.addEventListener('click', generatePDF);
    }

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
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    function updatePDFFilename() {
        const name = document.getElementById('input-name').value.trim();
        if (name) {
            const cleanName = name.toLowerCase().replace(/\s+/g, '-');
            downloadButton.textContent = `Download ${name.split(' ')[0]}'s Resume PDF`;
        } else {
            downloadButton.textContent = 'Download PDF';
        }
    }

    const nameInput = document.getElementById('input-name');
    if (nameInput) {
        nameInput.addEventListener('input', updatePDFFilename);
    }

    updatePDFFilename();


    function switchTemplate(templateName) {
        loadingOverlay.classList.remove('loading-hidden');
        
        templateButtons.forEach(btn => {
            if (btn.dataset.template === templateName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        const newTemplateLink = document.createElement('link');
        newTemplateLink.rel = 'stylesheet';
        newTemplateLink.id = 'resume-template';
        newTemplateLink.href = `templates/${templateName}.css`;
        
        newTemplateLink.onload = function() {
            const oldTemplate = document.getElementById('resume-template');
            if (oldTemplate && oldTemplate.parentNode) {
                oldTemplate.parentNode.removeChild(oldTemplate);
            }
            
            newTemplateLink.id = 'resume-template';
            
            loadingOverlay.classList.add('loading-hidden');
        };
        
        document.head.appendChild(newTemplateLink);
    }

    templateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const templateName = this.dataset.template;
            switchTemplate(templateName);
        });
    });

});