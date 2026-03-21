// ========== ALL TRANSLATIONS ==========
const translations = {
    en: {
        // Navbar
        logo: "Rohit Kumar",
        location: "Ariel University, Israel",
        navHome: "Home", navAbout: "About", navEducation: "Education", navResearch: "Research",
        navProjects: "Projects", navCertifications: "Certifications", navPublications: "Publications", navContact: "Contact",
        
        // Hero
        greeting: "Hi, I'm",
        name: "Rohit Kumar",
        badge1: "Ariel University, Israel",
        badge2: "NIT Hamirpur",
        badge3: "Astrophysics Researcher",
        cvBtn: "Download CV",
        contactBtn: "Contact Me",
        scrollText: "Scroll to explore",
        
        // About
        aboutTitle: "About Me",
        aboutLead: "🌌 Astrophysics Researcher | M.Sc. Physics @ Ariel University, Israel | NIT Hamirpur Alumnus",
        aboutPara1: "Namaste! I'm Rohit – a passionate physicist from a small village in Bihar, India, now exploring the cosmos at Ariel University, Israel. My journey from wondering about the stars on my village rooftop to actively researching black holes and galaxies is driven by an insatiable curiosity.",
        philosophyTitle: "🔭 Research Philosophy",
        philosophyText: "I believe that understanding the universe is not just about equations and data – it's about connecting our existence to the cosmos. My research focuses on unraveling the mysteries of Active Galactic Nuclei (AGN), black hole accretion physics, and galaxy evolution using multi-wavelength observations and computational simulations.",
        interests: ["Galaxy Formation", "Star Formation", "Black Hole Physics", "AGN Feedback", "FRBs", "Accretion Disks"],
        quoteText: "From a small village to the international stage – curiosity knows no boundaries. The universe is vast, and so is our potential to understand it.",
        stats: ["Research Projects", "Certifications", "Internships", "Countries"],
        
        // Education
        educationTitle: "Education",
        edu1Date: "2025 - Present", edu1Degree: "M.Sc. Physics", edu1Univ: "Ariel University, Israel",
        edu1Research: "Research: Accretion disk in eccentric binary systems",
        edu1Tags: ["Computational Astrophysics", "Binary Systems", "Accretion Physics"],
        edu2Date: "2021 - 2023", edu2Degree: "M.Sc. Physics", edu2Univ: "NIT Hamirpur, India",
        edu2Cgpa: "CGPA: 7.52/10",
        edu2Research: "Thesis: AGN Data Analysis & 150mm Newtonian Telescope Construction",
        edu2Tags: ["AGN", "X-ray Astronomy", "Telescope Making"],
        edu3Date: "2016 - 2020", edu3Degree: "B.Sc. Physics", edu3Univ: "IGNOU, Delhi",
        edu3Percent: "Percentage: 62%",
        
        // Research
        researchTitle: "Research Interests",
        researchCards: [
            {icon: "fa-black-hole", title: "Active Galactic Nuclei (AGN)", desc: "Studying supermassive black hole accretion, feedback mechanisms, and their role in galaxy evolution using multi-wavelength data.", tools: ["Swift BAT", "NuSTAR", "Fermi-LAT"] },
            {icon: "fa-circle-nodes", title: "Accretion Disk Physics", desc: "Investigating disk dynamics in eccentric binary systems and AGN environments through computational simulations.", tools: ["Python", "Hydrodynamics", "Simulations"] },
            {icon: "fa-galaxy", title: "Galaxy Formation & Evolution", desc: "Understanding how galaxies form, evolve, and interact with their central black holes across cosmic time.", tools: ["Cosmology", "Structure Formation", "Feedback"] },
            {icon: "fa-star", title: "Star Formation", desc: "Investigating the physical processes governing the birth of stars, from molecular cloud collapse to protostellar evolution.", tools: ["ISM Physics", "Molecular Clouds", "IMF"] },
            {icon: "fa-bolt", title: "Fast Radio Bursts (FRBs)", desc: "Exploring the origins and mechanisms behind these mysterious millisecond-duration radio transients.", tools: ["Radio Astronomy", "Transients", "Data Analysis"] },
            {icon: "fa-wave-square", title: "X-ray Astronomy", desc: "Analyzing hard X-ray data from space telescopes to study high-energy processes in black holes and AGN.", tools: ["X-ray Spectroscopy", "Timing Analysis", "Imaging"] }
        ],
        
        // Projects
        projectsTitle: "Research Projects",
        projects: [
            {title: "Accretion Disk in Eccentric Binary Systems", venue: "Ariel University, Israel", desc: "Simulating wind accretion and disk formation in eccentric binary star systems using computational hydrodynamics.", tags: ["Python", "Hydrodynamics", "Binary Stars", "Simulation"], featured: true },
            {title: "AGN & Blazar Analysis with NASA Telescopes", venue: "BHU Collaboration & Independent Research", desc: "Multi-wavelength study of Active Galactic Nuclei and blazars using hard X-ray data from Swift BAT, XRT, UVOT, Fermi-LAT, and NuSTAR telescopes.", tags: ["Swift BAT", "NuSTAR", "Fermi-LAT", "X-ray Analysis", "AGN"] },
            {title: "150mm Newtonian Reflecting Telescope", venue: "NIT Hamirpur", desc: "Designed and constructed a 150mm aperture Newtonian reflecting telescope for astronomical observations.", tags: ["Optics", "Telescope Making", "Observational Astronomy"] },
            {title: "Zooniverse Citizen Science", venue: "Part-time Independent Researcher", desc: "Active contributor to various Zooniverse projects, assisting in classification and data analysis for astronomy research.", tags: ["Citizen Science", "Data Classification", "Galaxy Morphology"] }
        ],
        
        // Certifications
        certificationsTitle: "Certifications & Trainings",
        certs: [
            {name: "Exploding Stars Investigation", org: "Vera C. Rubin Observatory & AAS", date: "July 2024"},
            {name: "Summer School in Theoretical (Astro)Physics", org: "IUCAA & St. Xavier's College", date: "June 2024"},
            {name: "Summer School Internship", org: "Indian Institute of Astrophysics (IIA)", date: "July 2023"},
            {name: "Student Internship", org: "Indian Centre for Space Physics (ICSP)", date: "Nov 2022"},
            {name: "Beginning Astronomy v2", org: "IUCAA & Central University HP", date: ""},
            {name: "Recent Progress in Astrophysics", org: "Amity University", date: "Nov 2022"},
            {name: "Theoretical & Data Analysis Techniques in Cosmology", org: "IUCAA & GHRCE Nagpur", date: "July 2024"},
            {name: "Data Analysis in Cosmology using Python", org: "IUCAA & Sardar Patel University", date: "Oct 2024"},
            {name: "Color the Universe", org: "Vera C. Rubin Observatory & AAS", date: "Feb 2025"},
            {name: "Summer Internship", org: "IIIT Kota", date: "July 2021"},
            {name: "English Course", org: "Oxford School of English, Delhi", date: "2019"}
        ],
        
        // Contact
        contactTitle: "Contact & Connect",
        emailLabel: "Email", phoneLabel: "Phone", locationLabel: "Location",
        locationDetail: "Currently: Ariel University, Israel<br>Permanent: Siwan, Bihar, India",
        linkedinText: "LinkedIn", githubText: "GitHub", blogText: "Blog",
        
        // Footer
        footerTitle: "Astrophysics Researcher",
        footerQuote: "\"We are all in the gutter, but some of us are looking at the stars.\" - Oscar Wilde",
        footerLocation: "Ariel University, Israel | NIT Hamirpur, India"
    },
    
    hi: {
        // Navbar
        logo: "रोहित कुमार",
        location: "एरियल यूनिवर्सिटी, इज़राइल",
        navHome: "होम", navAbout: "परिचय", navEducation: "शिक्षा", navResearch: "शोध",
        navProjects: "प्रोजेक्ट्स", navCertifications: "प्रमाणपत्र", navPublications: "प्रकाशन", navContact: "संपर्क",
        
        // Hero
        greeting: "नमस्ते, मैं हूं",
        name: "रोहित कुमार",
        badge1: "एरियल यूनिवर्सिटी, इज़राइल",
        badge2: "एनआईटी हमीरपुर",
        badge3: "खगोल भौतिकी शोधकर्ता",
        cvBtn: "सीवी डाउनलोड करें",
        contactBtn: "संपर्क करें",
        scrollText: "नीचे स्क्रॉल करें",
        
        // About
        aboutTitle: "परिचय",
        aboutLead: "🌌 खगोल भौतिकी शोधकर्ता | एम.एससी. भौतिकी @ एरियल यूनिवर्सिटी, इज़राइल | एनआईटी हमीरपुर से स्नातक",
        aboutPara1: "नमस्ते! मैं रोहित हूँ - बिहार के एक छोटे से गाँव से निकलकर आज इज़राइल में ब्रह्मांड के रहस्यों को समझने की कोशिश कर रहा हूँ। मेरी यात्रा गाँव की छत पर तारे गिनने से शुरू हुई और आज ब्लैक होल्स, आकाशगंगाओं और तारा निर्माण पर शोध कर रहा हूँ।",
        philosophyTitle: "🔭 मेरा शोध दर्शन",
        philosophyText: "मैं मानता हूँ कि ब्रह्मांड को समझना सिर्फ समीकरणों और डेटा तक सीमित नहीं है - यह हमारे अस्तित्व को ब्रह्मांड से जोड़ने का एक तरीका है। मेरा शोध सक्रिय आकाशगंगीय नाभिक (AGN), ब्लैक होल अभिवृद्धि भौतिकी, और आकाशगंगा विकास पर केंद्रित है।",
        interests: ["आकाशगंगा निर्माण", "तारा निर्माण", "ब्लैक होल भौतिकी", "AGN फीडबैक", "FRBs", "अभिवृद्धि डिस्क"],
        quoteText: "छोटे से गाँव से अंतरराष्ट्रीय मंच तक - जिज्ञासा की कोई सीमा नहीं होती। ब्रह्मांड विशाल है, और उसे समझने की हमारी क्षमता भी उतनी ही असीमित है।",
        stats: ["शोध प्रोजेक्ट्स", "प्रमाणपत्र", "इंटर्नशिप", "देश"],
        
        // Education
        educationTitle: "शिक्षा",
        edu1Date: "2025 - वर्तमान", edu1Degree: "एम.एससी. भौतिकी", edu1Univ: "एरियल यूनिवर्सिटी, इज़राइल",
        edu1Research: "शोध: विषम बाइनरी सिस्टम में अभिवृद्धि डिस्क",
        edu1Tags: ["संगणनात्मक खगोल भौतिकी", "बाइनरी सिस्टम", "अभिवृद्धि भौतिकी"],
        edu2Date: "2021 - 2023", edu2Degree: "एम.एससी. भौतिकी", edu2Univ: "एनआईटी हमीरपुर, भारत",
        edu2Cgpa: "सीजीपीए: 7.52/10",
        edu2Research: "थीसिस: AGN डेटा विश्लेषण और 150mm न्यूटोनियन टेलीस्कोप निर्माण",
        edu2Tags: ["AGN", "एक्स-रे खगोल विज्ञान", "टेलीस्कोप निर्माण"],
        edu3Date: "2016 - 2020", edu3Degree: "बी.एससी. भौतिकी", edu3Univ: "इग्नू, दिल्ली",
        edu3Percent: "प्रतिशत: 62%",
        
        // Research
        researchTitle: "शोध रुचियाँ",
        researchCards: [
            {icon: "fa-black-hole", title: "सक्रिय आकाशगंगीय नाभिक (AGN)", desc: "सुपरमैसिव ब्लैक होल अभिवृद्धि, फीडबैक तंत्र, और आकाशगंगा विकास में उनकी भूमिका का अध्ययन।", tools: ["स्विफ्ट BAT", "न्यूस्टार", "फर्मी-LAT"] },
            {icon: "fa-circle-nodes", title: "अभिवृद्धि डिस्क भौतिकी", desc: "विषम बाइनरी सिस्टम और AGN वातावरण में डिस्क गतिकी की संगणनात्मक सिमुलेशन के माध्यम से जांच।", tools: ["पायथन", "हाइड्रोडायनामिक्स", "सिमुलेशन"] },
            {icon: "fa-galaxy", title: "आकाशगंगा निर्माण और विकास", desc: "आकाशगंगाएँ कैसे बनती हैं, विकसित होती हैं, और अपने केंद्रीय ब्लैक होल के साथ कैसे अंतःक्रिया करती हैं।", tools: ["ब्रह्मांड विज्ञान", "संरचना निर्माण", "फीडबैक"] },
            {icon: "fa-star", title: "तारा निर्माण", desc: "आणविक बादलों के ढहने से लेकर प्रोटोस्टार विकास तक, तारों के जन्म की भौतिक प्रक्रियाओं का अध्ययन।", tools: ["आईएसएम भौतिकी", "आणविक बादल", "आईएमएफ"] },
            {icon: "fa-bolt", title: "फास्ट रेडियो बर्स्ट (FRBs)", desc: "इन रहस्यमयी मिलीसेकंड रेडियो संकेतों की उत्पत्ति और तंत्र की खोज।", tools: ["रेडियो खगोल विज्ञान", "क्षणिक घटनाएँ", "डेटा विश्लेषण"] },
            {icon: "fa-wave-square", title: "एक्स-रे खगोल विज्ञान", desc: "अंतरिक्ष दूरबीनों से एक्स-रे डेटा का विश्लेषण करके ब्लैक होल और AGN में उच्च-ऊर्जा प्रक्रियाओं का अध्ययन।", tools: ["एक्स-रे स्पेक्ट्रोस्कोपी", "टाइमिंग विश्लेषण", "इमेजिंग"] }
        ],
        
        // Projects
        projectsTitle: "शोध प्रोजेक्ट्स",
        projects: [
            {title: "विषम बाइनरी सिस्टम में अभिवृद्धि डिस्क", venue: "एरियल यूनिवर्सिटी, इज़राइल", desc: "संगणनात्मक हाइड्रोडायनामिक्स का उपयोग करके विषम बाइनरी स्टार सिस्टम में विंड अभिवृद्धि और डिस्क निर्माण का सिमुलेशन।", tags: ["पायथन", "हाइड्रोडायनामिक्स", "बाइनरी स्टार्स", "सिमुलेशन"], featured: true },
            {title: "NASA टेलीस्कोप के साथ AGN और ब्लेज़र विश्लेषण", venue: "बीएचयू सहयोग और स्वतंत्र शोध", desc: "स्विफ्ट BAT, XRT, UVOT, फर्मी-LAT, और न्यूस्टार टेलीस्कोप से हार्ड एक्स-रे डेटा का उपयोग करके सक्रिय आकाशगंगीय नाभिक और ब्लेज़र का बहु-तरंगदैर्ध्य अध्ययन।", tags: ["स्विफ्ट BAT", "न्यूस्टार", "फर्मी-LAT", "एक्स-रे विश्लेषण", "AGN"] },
            {title: "150mm न्यूटोनियन रिफ्लेक्टिंग टेलीस्कोप", venue: "एनआईटी हमीरपुर", desc: "खगोलीय अवलोकन के लिए 150mm एपर्चर न्यूटोनियन रिफ्लेक्टिंग टेलीस्कोप का डिजाइन और निर्माण।", tags: ["प्रकाशिकी", "टेलीस्कोप निर्माण", "अवलोकन खगोल विज्ञान"] },
            {title: "ज़ूनिवर्स सिटीजन साइंस", venue: "अंशकालिक स्वतंत्र शोधकर्ता", desc: "विभिन्न ज़ूनिवर्स परियोजनाओं में सक्रिय योगदान, खगोल विज्ञान अनुसंधान के लिए वर्गीकरण और डेटा विश्लेषण में सहायता।", tags: ["सिटीजन साइंस", "डेटा वर्गीकरण", "आकाशगंगा आकृति विज्ञान"] }
        ],
        
        // Certifications
        certificationsTitle: "प्रमाणपत्र और प्रशिक्षण",
        certs: [
            {name: "एक्सप्लोडिंग स्टार्स इन्वेस्टिगेशन", org: "वेरा सी. रुबिन वेधशाला और AAS", date: "जुलाई 2024"},
            {name: "सैद्धांतिक (खगोल) भौतिकी में समर स्कूल", org: "आईयूसीएए और सेंट जेवियर्स कॉलेज", date: "जून 2024"},
            {name: "समर स्कूल इंटर्नशिप", org: "भारतीय खगोल भौतिकी संस्थान (IIA)", date: "जुलाई 2023"},
            {name: "छात्र इंटर्नशिप", org: "भारतीय अंतरिक्ष भौतिकी केंद्र (ICSP)", date: "नवंबर 2022"},
            {name: "बिगिनिंग एस्ट्रोनॉमी v2", org: "आईयूसीएए और केंद्रीय विश्वविद्यालय हिमाचल प्रदेश", date: ""},
            {name: "खगोल भौतिकी में हालिया प्रगति", org: "एमिटी विश्वविद्यालय", date: "नवंबर 2022"},
            {name: "ब्रह्मांड विज्ञान में सैद्धांतिक और डेटा विश्लेषण तकनीक", org: "आईयूसीएए और जीएचआरसीई नागपुर", date: "जुलाई 2024"},
            {name: "पायथन का उपयोग करके ब्रह्मांड विज्ञान में डेटा विश्लेषण", org: "आईयूसीएए और सरदार पटेल विश्वविद्यालय", date: "अक्टूबर 2024"},
            {name: "रुबिन वेधशाला के साथ ब्रह्मांड को रंग दें", org: "वेरा सी. रुबिन वेधशाला और AAS", date: "फरवरी 2025"},
            {name: "समर इंटर्नशिप", org: "आईआईआईटी कोटा", date: "जुलाई 2021"},
            {name: "अंग्रेजी पाठ्यक्रम", org: "ऑक्सफोर्ड स्कूल ऑफ इंग्लिश, दिल्ली", date: "2019"}
        ],
        
        // Contact
        contactTitle: "संपर्क करें",
        emailLabel: "ईमेल", phoneLabel: "फोन", locationLabel: "स्थान",
        locationDetail: "वर्तमान: एरियल यूनिवर्सिटी, इज़राइल<br>स्थायी: सिवान, बिहार, भारत",
        linkedinText: "लिंक्डइन", githubText: "गिटहब", blogText: "ब्लॉग",
        
        // Footer
        footerTitle: "खगोल भौतिकी शोधकर्ता",
        footerQuote: "\"हम सभी गटर में हैं, लेकिन हममें से कुछ लोग तारों को देख रहे हैं।\" - ऑस्कर वाइल्ड",
        footerLocation: "एरियल यूनिवर्सिटी, इज़राइल | एनआईटी हमीरपुर, भारत"
    }
};

let currentLang = 'en';

// Typing Animation Variables
const typedTextSpan = document.querySelector('.typed-text');
let textArray = [];
let charIndex = 0;
let textArrayIndex = 0;
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;

function type() {
    if (typedTextSpan && textArray[textArrayIndex]) {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }
}

function erase() {
    if (typedTextSpan && textArray[textArrayIndex]) {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }
}

// ========== UPDATE ALL SECTIONS ==========
function updateLanguage(lang) {
    const t = translations[lang];
    
    // Update typing text array
    textArray = t.researchCards.map(card => card.title);
    
    // Update Navbar
    document.getElementById('logoText').textContent = t.logo;
    document.getElementById('locationText').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${t.location}`;
    document.getElementById('navHome').textContent = t.navHome;
    document.getElementById('navAbout').textContent = t.navAbout;
    document.getElementById('navEducation').textContent = t.navEducation;
    document.getElementById('navResearch').textContent = t.navResearch;
    document.getElementById('navProjects').textContent = t.navProjects;
    document.getElementById('navCertifications').textContent = t.navCertifications;
    document.getElementById('navPublications').textContent = t.navPublications;
    document.getElementById('navContact').textContent = t.navContact;
    
    // Mobile menu
    document.getElementById('mobileHome').textContent = t.navHome;
    document.getElementById('mobileAbout').textContent = t.navAbout;
    document.getElementById('mobileEducation').textContent = t.navEducation;
    document.getElementById('mobileResearch').textContent = t.navResearch;
    document.getElementById('mobileProjects').textContent = t.navProjects;
    document.getElementById('mobileCertifications').textContent = t.navCertifications;
    document.getElementById('mobilePublications').textContent = t.navPublications;
    document.getElementById('mobileContact').textContent = t.navContact;
    
    // Hero
    document.getElementById('heroGreeting').textContent = t.greeting;
    document.getElementById('heroName').textContent = t.name;
    document.getElementById('badge1').innerHTML = `<i class="fas fa-university"></i> ${t.badge1}`;
    document.getElementById('badge2').innerHTML = `<i class="fas fa-graduation-cap"></i> ${t.badge2}`;
    document.getElementById('badge3').innerHTML = `<i class="fas fa-star"></i> ${t.badge3}`;
    document.getElementById('cvBtn').innerHTML = `<i class="fas fa-download"></i> ${t.cvBtn}`;
    document.getElementById('contactBtn').innerHTML = `<i class="fas fa-paper-plane"></i> ${t.contactBtn}`;
    document.getElementById('scrollText').innerHTML = `<span>${t.scrollText}</span><i class="fas fa-chevron-down"></i>`;
    
    // About
    document.getElementById('aboutTitle').textContent = t.aboutTitle;
    document.getElementById('aboutLead').innerHTML = t.aboutLead;
    document.getElementById('aboutPara1').textContent = t.aboutPara1;
    document.getElementById('philosophyTitle').innerHTML = t.philosophyTitle;
    document.getElementById('philosophyText').innerHTML = t.philosophyText;
    for (let i = 0; i < t.interests.length; i++) {
        const el = document.getElementById(`interest${i+1}`);
        if (el) el.textContent = t.interests[i];
    }
    document.getElementById('quoteText').textContent = t.quoteText;
    for (let i = 0; i < t.stats.length; i++) {
        const el = document.getElementById(`stat${i+1}`);
        if (el) el.textContent = t.stats[i];
    }
    
    // Education
    document.getElementById('educationTitle').textContent = t.educationTitle;
    document.getElementById('edu1Date').textContent = t.edu1Date;
    document.getElementById('edu1Degree').textContent = t.edu1Degree;
    document.getElementById('edu1Univ').textContent = t.edu1Univ;
    document.getElementById('edu1Research').textContent = t.edu1Research;
    for (let i = 0; i < t.edu1Tags.length; i++) {
        const el = document.getElementById(`edu1Tag${i+1}`);
        if (el) el.textContent = t.edu1Tags[i];
    }
    document.getElementById('edu2Date').textContent = t.edu2Date;
    document.getElementById('edu2Degree').textContent = t.edu2Degree;
    document.getElementById('edu2Univ').textContent = t.edu2Univ;
    document.getElementById('edu2Cgpa').textContent = t.edu2Cgpa;
    document.getElementById('edu2Research').textContent = t.edu2Research;
    for (let i = 0; i < t.edu2Tags.length; i++) {
        const el = document.getElementById(`edu2Tag${i+1}`);
        if (el) el.textContent = t.edu2Tags[i];
    }
    document.getElementById('edu3Date').textContent = t.edu3Date;
    document.getElementById('edu3Degree').textContent = t.edu3Degree;
    document.getElementById('edu3Univ').textContent = t.edu3Univ;
    document.getElementById('edu3Percent').textContent = t.edu3Percent;
    
    // Research Grid
    document.getElementById('researchTitle').textContent = t.researchTitle;
    const researchGrid = document.getElementById('researchGrid');
    researchGrid.innerHTML = '';
    t.researchCards.forEach(card => {
        researchGrid.innerHTML += `
            <div class="research-card">
                <div class="research-icon"><i class="fas ${card.icon}"></i></div>
                <h3>${card.title}</h3>
                <p>${card.desc}</p>
                <div class="research-tools">${card.tools.map(tool => `<span>${tool}</span>`).join('')}</div>
            </div>
        `;
    });
    
    // Projects Grid
    document.getElementById('projectsTitle').textContent = t.projectsTitle;
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';
    t.projects.forEach(project => {
        projectsGrid.innerHTML += `
            <div class="project-card ${project.featured ? 'featured' : ''}">
                ${project.featured ? '<div class="featured-badge"><i class="fas fa-crown"></i> Featured Research</div>' : ''}
                <div class="project-header">
                    <i class="fas fa-code-branch project-icon"></i>
                    <span class="project-year"></span>
                </div>
                <h3>${project.title}</h3>
                <p class="project-venue">${project.venue}</p>
                <p class="project-description">${project.desc}</p>
                <div class="project-tags">${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
            </div>
        `;
    });
    
    // Certifications Grid
    document.getElementById('certificationsTitle').textContent = t.certificationsTitle;
    const certGrid = document.getElementById('certGrid');
    certGrid.innerHTML = '';
    t.certs.forEach(cert => {
        certGrid.innerHTML += `
            <div class="cert-card">
                <div class="cert-icon"><i class="fas fa-certificate"></i></div>
                <div>
                    <h3>${cert.name}</h3>
                    <p class="cert-org">${cert.org}</p>
                    ${cert.date ? `<p class="cert-date">${cert.date}</p>` : ''}
                </div>
            </div>
        `;
    });
    
    // Contact
    document.getElementById('contactTitle').textContent = t.contactTitle;
    document.getElementById('emailLabel').textContent = t.emailLabel;
    document.getElementById('phoneLabel').textContent = t.phoneLabel;
    document.getElementById('locationLabel').textContent = t.locationLabel;
    document.getElementById('locationDetail').innerHTML = t.locationDetail;
    document.getElementById('linkedinText').textContent = t.linkedinText;
    document.getElementById('githubText').textContent = t.githubText;
    document.getElementById('blogText').textContent = t.blogText;
    
    // Footer
    document.getElementById('footerName').textContent = t.logo;
    document.getElementById('footerTitle').textContent = t.footerTitle;
    document.getElementById('footerQuote').textContent = t.footerQuote;
    document.getElementById('footerLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${t.footerLocation}`;
    
    // Language button text
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.innerHTML = lang === 'en' ? '<i class="fas fa-language"></i> हिंदी' : '<i class="fas fa-language"></i> English';
    }
    
    // Reset typing animation
    if (typedTextSpan) {
        typedTextSpan.textContent = '';
        charIndex = 0;
        textArrayIndex = 0;
        type();
    }
}

// Language button click
const langToggle = document.getElementById('langToggle');
if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'hi' : 'en';
        updateLanguage(currentLang);
    });
}

// Initialize with English
setTimeout(() => {
    updateLanguage('en');
}, 100);

// ========== DARK MODE ==========
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('i');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
if (themeIcon) themeIcon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        if (themeIcon) themeIcon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    });
}

// ========== MOBILE MENU ==========
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = mobileMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });
    
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            if (mobileMenuBtn.querySelector('i')) mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        });
    });
}

// ========== NAVBAR SCROLL ==========
const navbar = document.querySelector('.navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 100) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }
    if (backToTop) {
        if (window.scrollY > 300) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
    }
});

if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ========== PARTICLES ==========
if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#0066cc' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#0066cc', opacity: 0.2, width: 1 },
            move: { enable: true, speed: 1, direction: 'none', random: true, out_mode: 'out' }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { grab: { distance: 200, line_linked: { opacity: 0.5 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });
}

// ========== CURRENT YEAR ==========
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ========== ANIMATIONS ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.section, .card, .research-card, .project-card, .cert-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(el);
});
