document.addEventListener('DOMContentLoaded', function() {

    const autocompleteDatasets = {
        locations: [
            "New York, USA", "London, UK", "Tokyo, Japan", "Paris, France", "Sydney, Australia",
            "Toronto, Canada", "Berlin, Germany", "Singapore, Singapore", "Dubai, UAE", "Mumbai, India",
            "San Francisco, USA", "Los Angeles, USA", "Chicago, USA", "Boston, USA", "Seattle, USA",
            "Vancouver, Canada", "Melbourne, Australia", "Hong Kong, China", "Shanghai, China", "Beijing, China",
            "Amsterdam, Netherlands", "Stockholm, Sweden", "Zurich, Switzerland", "Copenhagen, Denmark",
            "Austin, USA", "Miami, USA", "Atlanta, USA", "Denver, USA", "Philadelphia, USA"
        ],
        
        jobTitles: [
            "Software Engineer", "Senior Software Engineer", "Frontend Developer", "Backend Developer",
            "Full Stack Developer", "DevOps Engineer", "Data Scientist", "Machine Learning Engineer",
            "Product Manager", "Project Manager", "UI/UX Designer", "Graphic Designer",
            "Marketing Manager", "Sales Manager", "Business Analyst", "Data Analyst",
            "System Administrator", "Network Engineer", "Cloud Architect", "IT Manager",
            "Financial Analyst", "Accountant", "HR Manager", "Recruiter",
            "Content Writer", "Digital Marketing Specialist", "SEO Specialist", "Social Media Manager"
        ],
        
        degrees: [
            "Bachelor of Science in Computer Science", "Bachelor of Arts in Business Administration",
            "Master of Science in Data Science", "Master of Business Administration (MBA)",
            "Bachelor of Engineering", "Bachelor of Fine Arts", "Bachelor of Architecture",
            "Associate Degree in Information Technology", "Doctor of Philosophy (PhD) in Psychology",
            "Bachelor of Science in Nursing", "Bachelor of Education", "Bachelor of Laws (LLB)",
            "Master of Computer Science", "Master of Finance", "Master of Public Health",
            "Certified Public Accountant (CPA)", "Project Management Professional (PMP)",
            "Certified Information Systems Security Professional (CISSP)", "AWS Certified Solutions Architect"
        ],
        
        hardSkills: [
            "JavaScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Go", "Rust",
            "React", "Angular", "Vue.js", "Node.js", "Django", "Spring Boot", "Laravel", "Flask",
            "MySQL", "PostgreSQL", "MongoDB", "Redis", "Oracle", "SQL Server",
            "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform",
            "Git", "Jenkins", "CI/CD", "REST API", "GraphQL", "Microservices",
            "Machine Learning", "Data Analysis", "Artificial Intelligence", "Blockchain"
        ],
        
        softSkills: [
            "Communication", "Leadership", "Teamwork", "Problem Solving", "Critical Thinking",
            "Time Management", "Adaptability", "Creativity", "Work Ethic", "Attention to Detail",
            "Conflict Resolution", "Emotional Intelligence", "Presentation Skills", "Negotiation",
            "Collaboration", "Decision Making", "Strategic Planning", "Innovation", "Resilience"
        ],
        
        languages: [
            "English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Arabic",
            "Portuguese", "Russian", "Italian", "Dutch", "Swedish", "Norwegian", "Danish",
            "Hindi", "Bengali", "Turkish", "Polish", "Greek", "Hebrew", "Thai", "Vietnamese"
        ]
    };
    
    function initAutocomplete(inputElement, dataset, dropdownElement) {
        let isMouseInDropdown = false;
        
        dropdownElement.addEventListener('mouseenter', () => {
            isMouseInDropdown = true;
        });
        
        dropdownElement.addEventListener('mouseleave', () => {
            isMouseInDropdown = false;
        });
        
        inputElement.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            if (value.length < 2) {
                dropdownElement.classList.remove('open');
                return;
            }
            
            const filtered = dataset.filter(item => 
                item.toLowerCase().includes(value)
            ).slice(0, 8);
            
            if (filtered.length > 0) {
                dropdownElement.innerHTML = filtered.map(item => 
                    `<div class="autocomplete-option">${item}</div>`
                ).join('');
                dropdownElement.classList.add('open');
            } else {
                dropdownElement.classList.remove('open');
            }
        });
        
        inputElement.addEventListener('focus', function() {
            const value = this.value.toLowerCase();
            if (value.length >= 2) {
                const filtered = dataset.filter(item => 
                    item.toLowerCase().includes(value)
                ).slice(0, 8);
                
                if (filtered.length > 0) {
                    dropdownElement.innerHTML = filtered.map(item => 
                        `<div class="autocomplete-option">${item}</div>`
                    ).join('');
                    dropdownElement.classList.add('open');
                }
            }
        });
        
        inputElement.addEventListener('blur', function() {
            setTimeout(() => {
                if (!isMouseInDropdown) {
                    dropdownElement.classList.remove('open');
                }
            }, 200);
        });
        
        dropdownElement.addEventListener('click', function(e) {
            if (e.target.classList.contains('autocomplete-option')) {
                inputElement.value = e.target.textContent;
                dropdownElement.classList.remove('open');
                inputElement.focus();
            }
        });
        
        inputElement.addEventListener('keydown', function(e) {
            const options = dropdownElement.querySelectorAll('.autocomplete-option');
            let activeOption = dropdownElement.querySelector('.autocomplete-option.active');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!activeOption) {
                    activeOption = options[0];
                } else {
                    const next = activeOption.nextElementSibling;
                    activeOption = next || options[0];
                }
                options.forEach(opt => opt.classList.remove('active'));
                if (activeOption) activeOption.classList.add('active');
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (!activeOption) {
                    activeOption = options[options.length - 1];
                } else {
                    const prev = activeOption.previousElementSibling;
                    activeOption = prev || options[options.length - 1];
                }
                options.forEach(opt => opt.classList.remove('active'));
                if (activeOption) activeOption.classList.add('active');
            } else if (e.key === 'Enter') {
                if (activeOption) {
                    e.preventDefault();
                    inputElement.value = activeOption.textContent;
                    dropdownElement.classList.remove('open');
                }
            } else if (e.key === 'Escape') {
                dropdownElement.classList.remove('open');
            }
        });
    }
    
    function initAllAutocompletes() {
        initAutocomplete(
            document.getElementById('input-location'),
            autocompleteDatasets.locations,
            document.getElementById('location-dropdown')
        );
        
        initAutocomplete(
            document.getElementById('hard-skill-input'),
            autocompleteDatasets.hardSkills,
            document.getElementById('hard-skills-dropdown')
        );
        
        initAutocomplete(
            document.getElementById('soft-skill-input'),
            autocompleteDatasets.softSkills,
            document.getElementById('soft-skills-dropdown')
        );
        
        initAutocomplete(
            document.getElementById('language-input'),
            autocompleteDatasets.languages,
            document.getElementById('languages-dropdown')
        );
    }
    
    const resumeForm = document.getElementById('resume-form');
    const resumeToExport = document.getElementById('resume-to-export');
    const downloadButton = document.getElementById('download-pdf');
    const templateButtons = document.querySelectorAll('.template-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    const dynamicStylesheet = document.getElementById('resume-template');

    function initCustomDropdowns() {
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.custom-select')) {
                document.querySelectorAll('.select-options').forEach(option => {
                    option.classList.remove('open');
                });
            }
        });
        
        initDropdownsForContainer(document.body);
    }
    
    function initDropdownsForContainer(container) {
        container.querySelectorAll('.select-trigger').forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.stopPropagation();
                const optionsId = this.getAttribute('data-for');
                const options = document.getElementById(optionsId);
                const isOpen = options.classList.contains('open');
                
                document.querySelectorAll('.select-options').forEach(opt => {
                    if (opt !== options) opt.classList.remove('open');
                });
                
                options.classList.toggle('open', !isOpen);
            });
        });
        
        container.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const text = this.textContent;
                const options = this.parentElement;
                const selectId = options.id;
                const trigger = document.querySelector(`[data-for="${selectId}"]`);
                const hiddenInput = trigger.parentElement.querySelector('input[type="hidden"]');
                
                trigger.querySelector('.select-value').textContent = text;
                
                hiddenInput.value = value;
                
                options.classList.remove('open');
                
                hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
            });
        });
    }

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

            <!-- HARD SKILLS SECTION -->
            <div class="resume-section">
                <h2 class="section-title">Hard Skills</h2>
                <ul class="resume-list" id="preview-hard-skills">
                    <li>Your technical skills will appear here.</li>
                </ul>
            </div>

            <!-- SOFT SKILLS SECTION -->
            <div class="resume-section">
                <h2 class="section-title">Soft Skills</h2>
                <ul class="resume-list" id="preview-soft-skills">
                    <li>Your personal skills will appear here.</li>
                </ul>
            </div>

            <!-- LANGUAGES SECTION -->
            <div class="resume-section">
                <h2 class="section-title">Languages</h2>
                <ul class="resume-list" id="preview-languages">
                    <li>Your languages will appear here.</li>
                </ul>
            </div>
        `;
    }

    initializeResumeStructure();
    initCustomDropdowns();

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

    const hardSkillInput = document.getElementById('hard-skill-input');
    const addHardSkillButton = document.getElementById('add-hard-skill');
    const hardSkillsTagsContainer = document.getElementById('hard-skills-tags-container');
    const hardSkillsPreview = document.getElementById('preview-hard-skills');
    
    let hardSkillsArray = [];
    
    function addHardSkill() {
        const skill = hardSkillInput.value.trim();
        if (skill && !hardSkillsArray.includes(skill)) {
            hardSkillsArray.push(skill);
            updateHardSkillsTags();
            updateHardSkillsPreview();
            hardSkillInput.value = '';
        }
    }
    
    function removeHardSkill(skillToRemove) {
        hardSkillsArray = hardSkillsArray.filter(skill => skill !== skillToRemove);
        updateHardSkillsTags();
        updateHardSkillsPreview();
    }
    
    function updateHardSkillsTags() {
        hardSkillsTagsContainer.innerHTML = '';
        hardSkillsArray.forEach(skill => {
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                ${skill}
                <button type="button" class="remove-skill">×</button>
            `;
            tag.querySelector('.remove-skill').addEventListener('click', () => removeHardSkill(skill));
            hardSkillsTagsContainer.appendChild(tag);
        });
    }
    
    function updateHardSkillsPreview() {
        const hardSkillsSection = document.querySelector('.resume-section:nth-child(5)');
        
        hardSkillsPreview.innerHTML = '';
        if (hardSkillsArray.length === 0) {
            hardSkillsSection.style.display = 'none';
        } else {
            hardSkillsSection.style.display = 'block';
            hardSkillsArray.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                hardSkillsPreview.appendChild(li);
            });
        }
    }
    
    addHardSkillButton.addEventListener('click', addHardSkill);
    hardSkillInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addHardSkill();
    });

    const softSkillInput = document.getElementById('soft-skill-input');
    const addSoftSkillButton = document.getElementById('add-soft-skill');
    const softSkillsTagsContainer = document.getElementById('soft-skills-tags-container');
    const softSkillsPreview = document.getElementById('preview-soft-skills');
    
    let softSkillsArray = [];
    
    function addSoftSkill() {
        const skill = softSkillInput.value.trim();
        if (skill && !softSkillsArray.includes(skill)) {
            softSkillsArray.push(skill);
            updateSoftSkillsTags();
            updateSoftSkillsPreview();
            softSkillInput.value = '';
        }
    }
    
    function removeSoftSkill(skillToRemove) {
        softSkillsArray = softSkillsArray.filter(skill => skill !== skillToRemove);
        updateSoftSkillsTags();
        updateSoftSkillsPreview();
    }
    
    function updateSoftSkillsTags() {
        softSkillsTagsContainer.innerHTML = '';
        softSkillsArray.forEach(skill => {
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                ${skill}
                <button type="button" class="remove-skill">×</button>
            `;
            tag.querySelector('.remove-skill').addEventListener('click', () => removeSoftSkill(skill));
            softSkillsTagsContainer.appendChild(tag);
        });
    }
    
    function updateSoftSkillsPreview() {
        const softSkillsSection = document.querySelector('.resume-section:nth-child(6)');
        
        softSkillsPreview.innerHTML = '';
        if (softSkillsArray.length === 0) {
            softSkillsSection.style.display = 'none';
        } else {
            softSkillsSection.style.display = 'block';
            softSkillsArray.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                softSkillsPreview.appendChild(li);
            });
        }
    }
    
    addSoftSkillButton.addEventListener('click', addSoftSkill);
    softSkillInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addSoftSkill();
    });

    const languageInput = document.getElementById('language-input');
    const languageLevel = document.getElementById('language-level');
    const addLanguageButton = document.getElementById('add-language');
    const languagesTagsContainer = document.getElementById('languages-tags-container');
    const languagesPreview = document.getElementById('preview-languages');
    
    let languagesArray = [];
    
    function addLanguage() {
        const language = languageInput.value.trim();
        const level = languageLevel.value;
        if (language) {
            languagesArray.push({ language, level });
            updateLanguagesTags();
            updateLanguagesPreview();
            languageInput.value = '';
        }
    }
    
    function removeLanguage(languageToRemove) {
        languagesArray = languagesArray.filter(item => item.language !== languageToRemove);
        updateLanguagesTags();
        updateLanguagesPreview();
    }
    
    function updateLanguagesTags() {
        languagesTagsContainer.innerHTML = '';
        languagesArray.forEach(item => {
            const tag = document.createElement('div');
            tag.className = 'language-tag';
            tag.innerHTML = `
                ${item.language} (${item.level})
                <button type="button" class="remove-skill">×</button>
            `;
            tag.querySelector('.remove-skill').addEventListener('click', () => removeLanguage(item.language));
            languagesTagsContainer.appendChild(tag);
        });
    }
    
    function updateLanguagesPreview() {
        const languagesSection = document.querySelector('.resume-section:nth-child(7)');
        
        languagesPreview.innerHTML = '';
        if (languagesArray.length === 0) {
            languagesSection.style.display = 'none';
        } else {
            languagesSection.style.display = 'block';
            languagesArray.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.language} - ${item.level}`;
                languagesPreview.appendChild(li);
            });
        }
    }
    
    addLanguageButton.addEventListener('click', addLanguage);
    languageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addLanguage();
    });


    const experienceContainer = document.getElementById('experience-container');
    const addExperienceButton = document.getElementById('add-experience');
    const experiencePreview = document.getElementById('preview-experience');

    function getExperienceFormHTML() {
        const currentYear = new Date().getFullYear();
        const years = Array.from({length: 50}, (_, i) => currentYear - i);
        const months = [
            {value: 1, name: 'January'}, {value: 2, name: 'February'}, {value: 3, name: 'March'},
            {value: 4, name: 'April'}, {value: 5, name: 'May'}, {value: 6, name: 'June'},
            {value: 7, name: 'July'}, {value: 8, name: 'August'}, {value: 9, name: 'September'},
            {value: 10, name: 'October'}, {value: 11, name: 'November'}, {value: 12, name: 'December'}
        ];
        const days = Array.from({length: 31}, (_, i) => i + 1);
        
        return `
            <div class="dynamic-item">
                <button type="button" class="remove-btn">×</button>
                
                <label>Job Title</label>
                <div class="autocomplete-wrapper">
                    <input type="text" class="exp-job-title autocomplete-input" placeholder="e.g., Software Engineer">
                    <div class="autocomplete-dropdown exp-job-title-dropdown"></div>
                </div>
                
                <label>Company Name</label>
                <input type="text" class="exp-company" placeholder="e.g., Tech Solutions Inc.">
                
                <label>Location (City, Country)</label>
                <div class="autocomplete-wrapper">
                    <input type="text" class="exp-location autocomplete-input" placeholder="e.g., San Francisco, USA">
                    <div class="autocomplete-dropdown exp-location-dropdown"></div>
                </div>
                
                <!-- Start Date -->
                <div class="date-row">
                    <label>Start Date</label>
                    <div class="custom-date-selector">
                        <div class="custom-select">
                            <div class="select-trigger" data-for="exp-start-year">
                                <span class="select-value">Year</span>
                                <span class="arrow">▼</span>
                            </div>
                            <div class="select-options" id="exp-start-year">
                                ${years.map(year => `<div class="option" data-value="${year}">${year}</div>`).join('')}
                            </div>
                            <input type="hidden" class="exp-start-year" value="">
                        </div>
                        
                        <div class="custom-select">
                            <div class="select-trigger" data-for="exp-start-month">
                                <span class="select-value">Month</span>
                                <span class="arrow">▼</span>
                            </div>
                            <div class="select-options" id="exp-start-month">
                                ${months.map(month => `<div class="option" data-value="${month.value}">${month.name}</div>`).join('')}
                            </div>
                            <input type="hidden" class="exp-start-month" value="">
                        </div>
                        
                        <div class="custom-select">
                            <div class="select-trigger" data-for="exp-start-day">
                                <span class="select-value">Day</span>
                                <span class="arrow">▼</span>
                            </div>
                            <div class="select-options" id="exp-start-day">
                                ${days.map(day => `<div class="option" data-value="${day}">${day}</div>`).join('')}
                            </div>
                            <input type="hidden" class="exp-start-day" value="">
                        </div>
                    </div>
                </div>
                
                <!-- End Date -->
                <div class="date-row">
                    <label>End Date</label>
                    <div class="custom-date-selector">
                        <div class="custom-select">
                            <div class="select-trigger" data-for="exp-end-year">
                                <span class="select-value">Year</span>
                                <span class="arrow">▼</span>
                            </div>
                            <div class="select-options" id="exp-end-year">
                                ${years.map(year => `<div class="option" data-value="${year}">${year}</div>`).join('')}
                            </div>
                            <input type="hidden" class="exp-end-year" value="">
                        </div>
                        
                        <div class="custom-select">
                            <div class="select-trigger" data-for="exp-end-month">
                                <span class="select-value">Month</span>
                                <span class="arrow">▼</span>
                            </div>
                            <div class="select-options" id="exp-end-month">
                                ${months.map(month => `<div class="option" data-value="${month.value}">${month.name}</div>`).join('')}
                            </div>
                            <input type="hidden" class="exp-end-month" value="">
                        </div>
                        
                        <div class="custom-select">
                            <div class="select-trigger" data-for="exp-end-day">
                                <span class="select-value">Day</span>
                                <span class="arrow">▼</span>
                            </div>
                            <div class="select-options" id="exp-end-day">
                                ${days.map(day => `<div class="option" data-value="${day}">${day}</div>`).join('')}
                            </div>
                            <input type="hidden" class="exp-end-day" value="">
                        </div>
                    </div>
                </div>
                
                <label>Description & Responsibilities (one per line)</label>
                <textarea class="exp-description" rows="3" placeholder="• Managed a team of developers...&#10;• Implemented new features..."></textarea>
            </div>
        `;
    }

    function getExperiencePreviewHTML(experience = {}) {
        const { jobTitle = '', company = '', location = '', startMonth = '', startDay = '', startYear = '', endMonth = '', endDay = '', endYear = '', description = '' } = experience;
        
        const descriptionPoints = description ? description.split('\n').filter(point => point.trim() !== '') : [];
        
        return `
            <div class="experience-item">
                <div class="item-header">
                    <span>${jobTitle || 'Job Title'}</span>
                    <span>${formatDateRange(startYear, startMonth, startDay, endYear, endMonth, endDay)}</span>
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

    function formatDateRange(startYear, startMonth, startDay, endYear, endMonth, endDay) {
        if (!startYear) return '';
        
        const formatDate = (year, month, day) => {
            if (!year) return 'Present';
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthName = month ? monthNames[month - 1] : '';
            return monthName ? `${monthName} ${year}` : `${year}`;
        };
        
        return `${formatDate(startYear, startMonth, startDay)} - ${formatDate(endYear, endMonth, endDay)}`;
    }

    function updateExperiencePreview() {
        const experienceForms = experienceContainer.querySelectorAll('.dynamic-item');
        const experiencesData = [];
        
        experienceForms.forEach(form => {
            experiencesData.push({
                jobTitle: form.querySelector('.exp-job-title').value,
                company: form.querySelector('.exp-company').value,
                location: form.querySelector('.exp-location').value,
                startYear: form.querySelector('.exp-start-year').value,
                startMonth: form.querySelector('.exp-start-month').value,
                startDay: form.querySelector('.exp-start-day').value,
                endYear: form.querySelector('.exp-end-year').value,
                endMonth: form.querySelector('.exp-end-month').value,
                endDay: form.querySelector('.exp-end-day').value,
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
        
        initDropdownsForContainer(newForm);
        
        const jobTitleInput = newForm.querySelector('.exp-job-title');
        const jobTitleDropdown = newForm.querySelector('.exp-job-title-dropdown');
        const locationInput = newForm.querySelector('.exp-location');
        const locationDropdown = newForm.querySelector('.exp-location-dropdown');
        
        if (jobTitleInput && jobTitleDropdown) {
            initAutocomplete(jobTitleInput, autocompleteDatasets.jobTitles, jobTitleDropdown);
        }
        
        if (locationInput && locationDropdown) {
            initAutocomplete(locationInput, autocompleteDatasets.locations, locationDropdown);
        }
        
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
        const currentYear = new Date().getFullYear();
        const years = Array.from({length: 50}, (_, i) => currentYear - i);
        const months = [
            {value: 1, name: 'January'}, {value: 2, name: 'February'}, {value: 3, name: 'March'},
            {value: 4, name: 'April'}, {value: 5, name: 'May'}, {value: 6, name: 'June'},
            {value: 7, name: 'July'}, {value: 8, name: 'August'}, {value: 9, name: 'September'},
            {value: 10, name: 'October'}, {value: 11, name: 'November'}, {value: 12, name: 'December'}
        ];
        const days = Array.from({length: 31}, (_, i) => i + 1);
        
        return `
            <div class="dynamic-item">
                <button type="button" class="remove-btn">×</button>
                
                <label>Degree or Certification</label>
                <div class="autocomplete-wrapper">
                    <input type="text" class="edu-degree autocomplete-input" placeholder="e.g., Bachelor of Science in Computer Science">
                    <div class="autocomplete-dropdown edu-degree-dropdown"></div>
                </div>
                
                <label>Institution Name</label>
                <input type="text" class="edu-institution" placeholder="e.g., University of Technology">
                
                <label>Location (City, Country)</label>
                <div class="autocomplete-wrapper">
                    <input type="text" class="edu-location autocomplete-input" placeholder="e.g., New York, USA">
                    <div class="autocomplete-dropdown edu-location-dropdown"></div>
                </div>
                
                <!-- Start Date -->
                <div class="date-row">
                    <label>Start Date</label>
                    <div class="custom-date-selector">
                        <div class="custom-select">
                            <div class="select-trigger" data-for="edu-start-year">
                                <span class="select-value">Year</span>
                                <span class="arrow">▼</span>
                            </div>
                            <div class="select-options" id="edu-start-year">
                                ${years.map(year => `<div class="option" data-value="${year}">${year}</div>`).join('')}
                            </div>
                            <input type="hidden" class="edu-start-year" value="">
                        </div>
                        
                        <div class="custom-select">
                            <div class="select-trigger" data-for="edu-start-month">
                                <span class="select-value">Month</span>
                                <span class="arrow">▼</span>
                            </div>
                            <div class="select-options" id="edu-start-month">
                                ${months.map(month => `<div class="option" data-value="${month.value}">${month.name}</div>`).join('')}
                            </div>
                            <input type="hidden" class="edu-start-month" value="">
                        </div>
                        
                        <div class="custom-select">
                            <div class="select-trigger" data-for="edu-start-day">
                                <span class="select-value">Day</span>
                                <span class="arrow">▼</span>
                            </div>
                            <div class="select-options" id="edu-start-day">
                                ${days.map(day => `<div class="option" data-value="${day}">${day}</div>`).join('')}
                            </div>
                            <input type="hidden" class="edu-start-day" value="">
                        </div>
                    </div>
                </div>
                
                <!-- End Date -->
                <div class="date-row">
                    <label>End Date (or Expected)</label>
                    <div class="custom-date-selector">
                        <div class="custom-select">
                            <div class="select-trigger" data-for="edu-end-year">
                                <span class="select-value">Year</span>
                                <span class="arrow">▼</span>
                            </div>
                            <div class="select-options" id="edu-end-year">
                                ${years.map(year => `<div class="option" data-value="${year}">${year}</div>`).join('')}
                            </div>
                            <input type="hidden" class="edu-end-year" value="">
                        </div>
                        
                        <div class="custom-select">
                            <div class="select-trigger" data-for="edu-end-month">
                                <span class="select-value">Month</span>
                                <span class="arrow">▼</span>
                            </div>
                            <div class="select-options" id="edu-end-month">
                                ${months.map(month => `<div class="option" data-value="${month.value}">${month.name}</div>`).join('')}
                            </div>
                            <input type="hidden" class="edu-end-month" value="">
                        </div>
                        
                        <div class="custom-select">
                            <div class="select-trigger" data-for="edu-end-day">
                                <span class="select-value">Day</span>
                                <span class="arrow">▼</span>
                            </div>
                            <div class="select-options" id="edu-end-day">
                                ${days.map(day => `<div class="option" data-value="${day}">${day}</div>`).join('')}
                            </div>
                            <input type="hidden" class="edu-end-day" value="">
                        </div>
                    </div>
                </div>
                
                <label>Relevant Coursework or Achievements (optional, one per line)</label>
                <textarea class="edu-description" rows="2" placeholder="• Dean's List&#10;• Relevant Project..."></textarea>
            </div>
        `;
    }

    function getEducationPreviewHTML(education = {}) {
        const { degree = '', institution = '', location = '', startMonth = '', startDay = '', startYear = '', endMonth = '', endDay = '', endYear = '', description = '' } = education;
        
        const descriptionPoints = description ? description.split('\n').filter(point => point.trim() !== '') : [];
        
        return `
            <div class="education-item">
                <div class="item-header">
                    <span>${degree || 'Degree/Certification'}</span>
                    <span>${formatDateRange(startYear, startMonth, startDay, endYear, endMonth, endDay)}</span>
                    
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
                startYear: form.querySelector('.edu-start-year').value,
                startMonth: form.querySelector('.edu-start-month').value,
                startDay: form.querySelector('.edu-start-day').value,
                endYear: form.querySelector('.edu-end-year').value,
                endMonth: form.querySelector('.edu-end-month').value,
                endDay: form.querySelector('.edu-end-day').value,
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
        
        initDropdownsForContainer(newForm);
        
        const degreeInput = newForm.querySelector('.edu-degree');
        const degreeDropdown = newForm.querySelector('.edu-degree-dropdown');
        const locationInput = newForm.querySelector('.edu-location');
        const locationDropdown = newForm.querySelector('.edu-location-dropdown');
        
        if (degreeInput && degreeDropdown) {
            initAutocomplete(degreeInput, autocompleteDatasets.degrees, degreeDropdown);
        }
        
        if (locationInput && locationDropdown) {
            initAutocomplete(locationInput, autocompleteDatasets.locations, locationDropdown);
        }
        
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

    initAllAutocompletes();

});