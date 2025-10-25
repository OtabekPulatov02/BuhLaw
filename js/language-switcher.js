class LanguageSwitcher {
    constructor() {
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'ru';
        this.translations = null;
        this.init();
    }

    async init() {
        try {
            await this.loadTranslations();
            this.createLanguageSwitcher();
            this.applyLanguage(this.currentLanguage);
            this.bindEvents();
        } catch (error) {
            console.error('Error initializing language switcher:', error);
        }
    }

    async loadTranslations() {
        try {
            const response = await fetch('js/translations.json');
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            throw error;
        }
    }

    createLanguageSwitcher() {
        // Find the nav container
        const navContainer = document.querySelector('.nav-container');
        if (!navContainer) return;

        // Create language switcher container
        const languageSwitcher = document.createElement('div');
        languageSwitcher.className = 'language-switcher';
        languageSwitcher.style.cssText = `
            position: relative;
            display: inline-block;
            margin-left: 20px;
        `;

        // Create button
        const button = document.createElement('button');
        button.className = 'language-btn';
        button.style.cssText = `
            background: var(--primary-teal);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        `;

        // Create flag icons
        const flags = {
            'ru': '🇷🇺',
            'uz': '🇺🇿',
            'en': '🇺🇸'
        };

        const languageNames = {
            'ru': 'RU',
            'uz': 'UZ',
            'en': 'EN'
        };

        button.innerHTML = `
            <span class="flag">${flags[this.currentLanguage]}</span>
            <span class="lang-code">${languageNames[this.currentLanguage]}</span>
            <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
        `;

        // Create dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'language-dropdown';
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            min-width: 120px;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;

        // Create language options
        const languages = [
            { code: 'ru', name: 'Русский', flag: '🇷🇺' },
            { code: 'uz', name: 'O\'zbek', flag: '🇺🇿' },
            { code: 'en', name: 'English', flag: '🇺🇸' }
        ];

        languages.forEach(lang => {
            const option = document.createElement('div');
            option.className = 'language-option';
            option.dataset.lang = lang.code;
            option.style.cssText = `
                padding: 12px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background-color 0.2s ease;
                border-radius: 6px;
                margin: 4px;
            `;

            option.innerHTML = `
                <span class="flag">${lang.flag}</span>
                <span class="lang-name">${lang.name}</span>
            `;

            option.addEventListener('mouseenter', () => {
                option.style.backgroundColor = 'var(--bg-light)';
            });

            option.addEventListener('mouseleave', () => {
                option.style.backgroundColor = 'transparent';
            });

            option.addEventListener('click', () => {
                this.switchLanguage(lang.code);
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
                dropdown.style.transform = 'translateY(-10px)';
            });

            dropdown.appendChild(option);
        });

        languageSwitcher.appendChild(button);
        languageSwitcher.appendChild(dropdown);

        // Insert before contact button
        const contactBtn = navContainer.querySelector('.contact-btn');
        if (contactBtn) {
            navContainer.insertBefore(languageSwitcher, contactBtn);
        } else {
            navContainer.appendChild(languageSwitcher);
        }

        // Toggle dropdown
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.style.opacity === '1';
            
            if (isOpen) {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
                dropdown.style.transform = 'translateY(-10px)';
            } else {
                dropdown.style.opacity = '1';
                dropdown.style.visibility = 'visible';
                dropdown.style.transform = 'translateY(0)';
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!languageSwitcher.contains(e.target)) {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
                dropdown.style.transform = 'translateY(-10px)';
            }
        });

        // Hover effects
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = 'var(--dark-teal)';
            button.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = 'var(--primary-teal)';
            button.style.transform = 'translateY(0)';
        });
    }

    switchLanguage(langCode) {
        this.currentLanguage = langCode;
        localStorage.setItem('selectedLanguage', langCode);
        this.applyLanguage(langCode);
        this.updateLanguageButton(langCode);
    }

    updateLanguageButton(langCode) {
        const button = document.querySelector('.language-btn');
        if (!button) return;

        const flags = {
            'ru': '🇷🇺',
            'uz': '🇺🇿',
            'en': '🇺🇸'
        };

        const languageNames = {
            'ru': 'RU',
            'uz': 'UZ',
            'en': 'EN'
        };

        button.innerHTML = `
            <span class="flag">${flags[langCode]}</span>
            <span class="lang-code">${languageNames[langCode]}</span>
            <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
        `;
    }

    applyLanguage(langCode) {
        if (!this.translations || !this.translations[langCode]) {
            console.error('Translations not loaded for language:', langCode);
            return;
        }

        const t = this.translations[langCode];

        // Update navigation
        this.updateText('[data-translate="nav.home"]', t.nav.home);
        this.updateText('[data-translate="nav.services"]', t.nav.services);
        this.updateText('[data-translate="nav.about"]', t.nav.about);
        this.updateText('[data-translate="nav.contacts"]', t.nav.contacts);

        // Update hero section
        this.updateHTML('[data-translate="hero.title"]', t.hero.title);
        this.updateText('[data-translate="hero.cta"]', t.hero.cta);

        // Update services section
        this.updateText('[data-translate="services.title"]', t.services.title);
        this.updateText('[data-translate="services.subtitle"]', t.services.subtitle);
        this.updateText('[data-translate="services.accounting.title"]', t.services.accounting.title);
        this.updateText('[data-translate="services.accounting.description"]', t.services.accounting.description);
        this.updateText('[data-translate="services.accounting.more"]', t.services.accounting.more);
        this.updateText('[data-translate="services.hr.title"]', t.services.hr.title);
        this.updateText('[data-translate="services.hr.description"]', t.services.hr.description);
        this.updateText('[data-translate="services.hr.more"]', t.services.hr.more);
        this.updateText('[data-translate="services.additional.title"]', t.services.additional.title);
        this.updateText('[data-translate="services.additional.description"]', t.services.additional.description);
        this.updateText('[data-translate="services.additional.more"]', t.services.additional.more);

        // Update advantages section
        this.updateText('[data-translate="advantages.title"]', t.advantages.title);
        this.updateText('[data-translate="advantages.experience.title"]', t.advantages.experience.title);
        this.updateText('[data-translate="advantages.experience.description"]', t.advantages.experience.description);
        this.updateText('[data-translate="advantages.timeliness.title"]', t.advantages.timeliness.title);
        this.updateText('[data-translate="advantages.timeliness.description"]', t.advantages.timeliness.description);
        this.updateText('[data-translate="advantages.confidentiality.title"]', t.advantages.confidentiality.title);
        this.updateText('[data-translate="advantages.confidentiality.description"]', t.advantages.confidentiality.description);
        this.updateText('[data-translate="advantages.languages.title"]', t.advantages.languages.title);
        this.updateText('[data-translate="advantages.languages.description"]', t.advantages.languages.description);
        this.updateText('[data-translate="advantages.learn_more"]', t.advantages.learn_more);

        // Update pain points section
        this.updateText('[data-translate="pain_points.title"]', t.pain_points.title);
        this.updateText('[data-translate="pain_points.subtitle"]', t.pain_points.subtitle);
        this.updateText('[data-translate="pain_points.late_reports.problem"]', t.pain_points.late_reports.problem);
        this.updateText('[data-translate="pain_points.late_reports.solution"]', t.pain_points.late_reports.solution);
        this.updateText('[data-translate="pain_points.expensive_accountant.problem"]', t.pain_points.expensive_accountant.problem);
        this.updateText('[data-translate="pain_points.expensive_accountant.solution"]', t.pain_points.expensive_accountant.solution);
        this.updateText('[data-translate="pain_points.sick_accountant.problem"]', t.pain_points.sick_accountant.problem);
        this.updateText('[data-translate="pain_points.sick_accountant.solution"]', t.pain_points.sick_accountant.solution);
        this.updateText('[data-translate="pain_points.paper_chaos.problem"]', t.pain_points.paper_chaos.problem);
        this.updateText('[data-translate="pain_points.paper_chaos.solution"]', t.pain_points.paper_chaos.solution);
        this.updateText('[data-translate="pain_points.complex_taxes.problem"]', t.pain_points.complex_taxes.problem);
        this.updateText('[data-translate="pain_points.complex_taxes.solution"]', t.pain_points.complex_taxes.solution);
        this.updateText('[data-translate="pain_points.need_advisor.problem"]', t.pain_points.need_advisor.problem);
        this.updateText('[data-translate="pain_points.need_advisor.solution"]', t.pain_points.need_advisor.solution);

        // Update how we work section
        this.updateText('[data-translate="how_we_work.title"]', t.how_we_work.title);
        this.updateText('[data-translate="how_we_work.subtitle"]', t.how_we_work.subtitle);
        this.updateText('[data-translate="how_we_work.step1.title"]', t.how_we_work.step1.title);
        this.updateText('[data-translate="how_we_work.step1.description"]', t.how_we_work.step1.description);
        this.updateText('[data-translate="how_we_work.step2.title"]', t.how_we_work.step2.title);
        this.updateText('[data-translate="how_we_work.step2.description"]', t.how_we_work.step2.description);
        this.updateText('[data-translate="how_we_work.step3.title"]', t.how_we_work.step3.title);
        this.updateText('[data-translate="how_we_work.step3.description"]', t.how_we_work.step3.description);
        this.updateText('[data-translate="how_we_work.contact_us"]', t.how_we_work.contact_us);

        // Update stats section
        this.updateText('[data-translate="stats.years"]', t.stats.years);
        this.updateText('[data-translate="stats.consultations"]', t.stats.consultations);
        this.updateText('[data-translate="stats.cases"]', t.stats.cases);
        this.updateText('[data-translate="stats.clients"]', t.stats.clients);

        // Update footer
        this.updateText('[data-translate="footer.description"]', t.footer.description);
        this.updateText('[data-translate="footer.motto"]', t.footer.motto);
        this.updateText('[data-translate="footer.contacts"]', t.footer.contacts);
        this.updateText('[data-translate="footer.navigation"]', t.footer.navigation);
        this.updateText('[data-translate="footer.working_hours"]', t.footer.working_hours);
        this.updateText('[data-translate="footer.weekdays"]', t.footer.weekdays);
        this.updateText('[data-translate="footer.saturday"]', t.footer.saturday);
        this.updateText('[data-translate="footer.sunday"]', t.footer.sunday);
        this.updateText('[data-translate="footer.copyright"]', t.footer.copyright);

        // Update about page
        this.updateText('[data-translate="about.title"]', t.about?.title || '');
        this.updateText('[data-translate="about.subtitle"]', t.about?.subtitle || '');
        this.updateText('[data-translate="about.history.title"]', t.about?.history?.title || '');
        this.updateText('[data-translate="about.history.text1"]', t.about?.history?.text1 || '');
        this.updateText('[data-translate="about.history.text2"]', t.about?.history?.text2 || '');
        this.updateText('[data-translate="about.history.text3"]', t.about?.history?.text3 || '');
        this.updateText('[data-translate="about.values.title"]', t.about?.values?.title || '');
        this.updateText('[data-translate="about.values.trust.title"]', t.about?.values?.trust?.title || '');
        this.updateText('[data-translate="about.values.trust.description"]', t.about?.values?.trust?.description || '');
        this.updateText('[data-translate="about.values.professionalism.title"]', t.about?.values?.professionalism?.title || '');
        this.updateText('[data-translate="about.values.professionalism.description"]', t.about?.values?.professionalism?.description || '');
        this.updateText('[data-translate="about.values.client_focus.title"]', t.about?.values?.client_focus?.title || '');
        this.updateText('[data-translate="about.values.client_focus.description"]', t.about?.values?.client_focus?.description || '');
        this.updateText('[data-translate="about.values.efficiency.title"]', t.about?.values?.efficiency?.title || '');
        this.updateText('[data-translate="about.values.efficiency.description"]', t.about?.values?.efficiency?.description || '');
        this.updateText('[data-translate="about.values.honesty.title"]', t.about?.values?.honesty?.title || '');
        this.updateText('[data-translate="about.values.honesty.description"]', t.about?.values?.honesty?.description || '');
        this.updateText('[data-translate="about.values.development.title"]', t.about?.values?.development?.title || '');
        this.updateText('[data-translate="about.values.development.description"]', t.about?.values?.development?.description || '');
        this.updateText('[data-translate="about.team.title"]', t.about?.team?.title || '');
        this.updateText('[data-translate="about.team.subtitle"]', t.about?.team?.subtitle || '');
        this.updateText('[data-translate="about.team.director.name"]', t.about?.team?.director?.name || '');
        this.updateText('[data-translate="about.team.director.position"]', t.about?.team?.director?.position || '');
        this.updateText('[data-translate="about.team.director.description"]', t.about?.team?.director?.description || '');
        this.updateText('[data-translate="about.team.accountant.name"]', t.about?.team?.accountant?.name || '');
        this.updateText('[data-translate="about.team.accountant.position"]', t.about?.team?.accountant?.position || '');
        this.updateText('[data-translate="about.team.accountant.description"]', t.about?.team?.accountant?.description || '');
        this.updateText('[data-translate="about.team.hr_manager.name"]', t.about?.team?.hr_manager?.name || '');
        this.updateText('[data-translate="about.team.hr_manager.position"]', t.about?.team?.hr_manager?.position || '');
        this.updateText('[data-translate="about.team.hr_manager.description"]', t.about?.team?.hr_manager?.description || '');
        this.updateText('[data-translate="about.cta.title"]', t.about?.cta?.title || '');
        this.updateText('[data-translate="about.cta.subtitle"]', t.about?.cta?.subtitle || '');
        this.updateText('[data-translate="about.cta.button"]', t.about?.cta?.button || '');

        // Update services page
        this.updateText('[data-translate="services.page_title"]', t.services?.page_title || '');
        this.updateText('[data-translate="services.page_subtitle"]', t.services?.page_subtitle || '');
        this.updateText('[data-translate="services.pricing.title"]', t.services?.pricing?.title || '');
        this.updateText('[data-translate="services.pricing.subtitle"]', t.services?.pricing?.subtitle || '');
        this.updateText('[data-translate="services.pricing.basic.title"]', t.services?.pricing?.basic?.title || '');
        this.updateText('[data-translate="services.pricing.popular.title"]', t.services?.pricing?.popular?.title || '');
        this.updateText('[data-translate="services.pricing.premium.title"]', t.services?.pricing?.premium?.title || '');
        this.updateText('[data-translate="services.accounting.title"]', t.services?.accounting?.title || '');
        this.updateText('[data-translate="services.accounting.description"]', t.services?.accounting?.description || '');
        this.updateText('[data-translate="services.accounting.subdescription"]', t.services?.accounting?.subdescription || '');
        this.updateText('[data-translate="services.hr.title"]', t.services?.hr?.title || '');
        this.updateText('[data-translate="services.hr.description"]', t.services?.hr?.description || '');
        this.updateText('[data-translate="services.hr.subdescription"]', t.services?.hr?.subdescription || '');
        this.updateText('[data-translate="services.additional.title"]', t.services?.additional?.title || '');
        this.updateText('[data-translate="services.additional.description"]', t.services?.additional?.description || '');
        this.updateText('[data-translate="services.additional.subdescription"]', t.services?.additional?.subdescription || '');
        this.updateText('[data-translate="services.cta.title"]', t.services?.cta?.title || '');
        this.updateText('[data-translate="services.cta.subtitle"]', t.services?.cta?.subtitle || '');
        this.updateText('[data-translate="services.cta.button"]', t.services?.cta?.button || '');

        // Update contacts page
        this.updateText('[data-translate="contacts.page_title"]', t.contacts?.page_title || '');
        this.updateText('[data-translate="contacts.page_subtitle"]', t.contacts?.page_subtitle || '');
        this.updateText('[data-translate="contacts.contact_info.title"]', t.contacts?.contact_info?.title || '');
        this.updateText('[data-translate="contacts.contact_info.address.title"]', t.contacts?.contact_info?.address?.title || '');
        this.updateText('[data-translate="contacts.contact_info.phone.title"]', t.contacts?.contact_info?.phone?.title || '');
        this.updateText('[data-translate="contacts.contact_info.email.title"]', t.contacts?.contact_info?.email?.title || '');
        this.updateText('[data-translate="contacts.contact_info.working_hours.title"]', t.contacts?.contact_info?.working_hours?.title || '');
        this.updateText('[data-translate="contacts.contact_info.working_hours.weekdays"]', t.contacts?.contact_info?.working_hours?.weekdays || '');
        this.updateText('[data-translate="contacts.contact_info.working_hours.saturday"]', t.contacts?.contact_info?.working_hours?.saturday || '');
        this.updateText('[data-translate="contacts.contact_info.working_hours.sunday"]', t.contacts?.contact_info?.working_hours?.sunday || '');
        this.updateText('[data-translate="contacts.form.title"]', t.contacts?.form?.title || '');
        this.updateText('[data-translate="contacts.form.name"]', t.contacts?.form?.name || '');
        this.updateText('[data-translate="contacts.form.phone"]', t.contacts?.form?.phone || '');
        this.updateText('[data-translate="contacts.form.email"]', t.contacts?.form?.email || '');
        this.updateText('[data-translate="contacts.form.service"]', t.contacts?.form?.service || '');
        this.updateText('[data-translate="contacts.form.message"]', t.contacts?.form?.message || '');
        this.updateText('[data-translate="contacts.form.submit"]', t.contacts?.form?.submit || '');
        this.updateText('[data-translate="contacts.faq.title"]', t.contacts?.faq?.title || '');
    }

    updateText(selector, text) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.textContent = text;
        });
    }

    updateHTML(selector, html) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.innerHTML = html;
        });
    }

    bindEvents() {
        // Add any additional event bindings here
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSwitcher();
});
