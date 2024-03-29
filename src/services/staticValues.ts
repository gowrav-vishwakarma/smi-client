export const _topics = [
  "Accounting",
  "Advertising",
  "Aerospace",
  "Agriculture",
  "Architecture",
  "Banking",
  "Technology",
  "Other",
  "Utilities",
];

export interface Topic_ {
  name: string;
  subtopics?: Topic_[];
}

export interface Topic {
  label: string;
  children?: Topic[];
}

export const topics = [
  {
    id: "Agriculture",
    label: "Agriculture",
    children: [
      { id: "Crop Production", label: "Crop Production" },
      { id: "Livestock Management", label: "Livestock Management" },
      { id: "Horticulture", label: "Horticulture" },
      { id: "Agricultural Technology", label: "Agricultural Technology" },
      { id: "Soil Science", label: "Soil Science" },
      { id: "Agribusiness", label: "Agribusiness" },
    ],
  },
  {
    id: "Arts and Humanities",
    label: "Arts and Humanities",
    children: [
      { id: "Visual Arts", label: "Visual Arts" },
      { id: "Performing Arts", label: "Performing Arts" },
      { id: "History", label: "History" },
      { id: "Literature", label: "Literature" },
      { id: "Philosophy", label: "Philosophy" },
      { id: "Languages", label: "Languages" },
    ],
  },
  {
    id: "Business and Finance",
    label: "Business and Finance",
    children: [
      { id: "Accounting", label: "Accounting" },
      { id: "Marketing", label: "Marketing" },
      { id: "Human Resources", label: "Human Resources" },
      { id: "Management", label: "Management" },
      { id: "Entrepreneurship", label: "Entrepreneurship" },
      { id: "Investment", label: "Investment" },
    ],
  },
  {
    id: "Computer Science",
    label: "Computer Science",
    children: [
      {
        id: "Programming Languages",
        label: "Programming Languages",
        children: [
          { id: "Python", label: "Python" },
          {
            id: "JavaScript",
            label: "JavaScript",
            children: [
              { id: "ES6+", label: "ES6+" },
              { id: "TypeScript", label: "TypeScript" },
              { id: "jQuery", label: "jQuery" },
              { id: "Node.js", label: "Node.js" },
            ],
          },
          { id: "Java", label: "Java" },
          { id: "C++", label: "C++" },
          { id: "C#", label: "C#" },
          { id: "Ruby", label: "Ruby" },
          { id: "PHP", label: "PHP" },
          { id: "Swift", label: "Swift" },
          { id: "Kotlin", label: "Kotlin" },
          { id: "Go", label: "Go" },
          { id: "Rust", label: "Rust" },
          { id: "R", label: "R" },
          { id: "MATLAB", label: "MATLAB" },
          { id: "Scala", label: "Scala" },
          { id: "Lua", label: "Lua" },
          { id: "Shell Scripting", label: "Shell Scripting" },
        ],
      },
      {
        id: "Web Development",
        label: "Web Development",
        children: [
          {
            id: "HTML",
            label: "HTML",
            children: [
              { id: "HTML5", label: "HTML5" },
              { id: "Semantic HTML", label: "Semantic HTML" },
              { id: "HTML Forms", label: "HTML Forms" },
            ],
          },
          {
            id: "CSS",
            label: "CSS",
            children: [
              { id: "CSS3", label: "CSS3" },
              { id: "Flexbox", label: "Flexbox" },
              { id: "CSS Grid", label: "CSS Grid" },
              { id: "Responsive Design", label: "Responsive Design" },
              { id: "SASS", label: "SASS" },
              { id: "LESS", label: "LESS" },
              { id: "PostCSS", label: "PostCSS" },
              { id: "CSS-in-JS", label: "CSS-in-JS" },
              { id: "Tailwind CSS", label: "Tailwind CSS" },
            ],
          },

          {
            id: "Front-end Frameworks",
            label: "Front-end Frameworks",
            children: [
              { id: "React.js", label: "React.js" },
              { id: "Angular.js", label: "Angular.js" },
              { id: "Vue.js", label: "Vue.js" },
              { id: "Svelte", label: "Svelte" },
            ],
          },
          {
            id: "Back-end Frameworks",
            label: "Back-end Frameworks",
            children: [
              { id: "Express.js", label: "Express.js" },
              { id: "Django", label: "Django" },
              { id: "Ruby on Rails", label: "Ruby on Rails" },
              { id: "Laravel", label: "Laravel" },
              { id: "Spring Boot", label: "Spring Boot" },
            ],
          },
          {
            id: "Databases",
            label: "Databases",
            children: [
              { id: "SQL", label: "SQL" },
              { id: "MySQL", label: "MySQL" },
              { id: "PostgreSQL", label: "PostgreSQL" },
              { id: "MongoDB", label: "MongoDB" },
              { id: "NoSQL", label: "NoSQL" },
              { id: "Firebase", label: "Firebase" },
            ],
          },
          {
            id: "Web Servers",
            label: "Web Servers",
            children: [
              { id: "Apache", label: "Apache" },
              { id: "Nginx", label: "Nginx" },
              { id: "IIS", label: "IIS" },
              {
                id: "Node.js as a web server",
                label: "Node.js as a web server",
              },
            ],
          },
          {
            id: "Web Performance Optimization",
            label: "Web Performance Optimization",
            children: [
              { id: "Minification", label: "Minification" },
              { id: "Bundling", label: "Bundling" },
              { id: "Caching", label: "Caching" },
              { id: "Lazy Loading", label: "Lazy Loading" },
              { id: "Critical Render Path", label: "Critical Render Path" },
              { id: "Progressive Web Apps", label: "Progressive Web Apps" },
            ],
          },
          {
            id: "Web Accessibility",
            label: "Web Accessibility",
            children: [
              { id: "ARIA", label: "ARIA" },
              { id: "WCAG", label: "WCAG" },
              { id: "Inclusive Design", label: "Inclusive Design" },
              { id: "Color Contrast", label: "Color Contrast" },
              { id: "Keyboard Navigation", label: "Keyboard Navigation" },
              { id: "Screen Readers", label: "Screen Readers" },
              {
                id: "Accessibility Testing Tools",
                label: "Accessibility Testing Tools",
              },
            ],
          },
          {
            id: "Web Development Tools",
            label: "Web Development Tools",
            children: [
              {
                id: "Version Control",
                label: "Version Control",
                children: [
                  { id: "Git", label: "Git" },
                  { id: "Subversion (SVN)", label: "Subversion (SVN)" },
                  { id: "Mercurial", label: "Mercurial" },
                ],
              },
              {
                id: "Package Managers",
                label: "Package Managers",
                children: [
                  { id: "npm", label: "npm" },
                  { id: "Yarn", label: "Yarn" },
                  { id: "pip", label: "pip" },
                  { id: "composer", label: "composer" },
                ],
              },
              {
                id: "Bundlers",
                label: "Bundlers",
                children: [
                  { id: "Webpack", label: "Webpack" },
                  { id: "Rollup", label: "Rollup" },
                  { id: "Parcel", label: "Parcel" },
                ],
              },
              {
                id: "Transpilers",
                label: "Transpilers",
                children: [{ id: "Babel", label: "Babel" }],
              },
              {
                id: "Task Runners",
                label: "Task Runners",
                children: [
                  { id: "Grunt", label: "Grunt" },
                  { id: "Gulp", label: "Gulp" },
                ],
              },
              {
                id: "Debugging Tools",
                label: "Debugging Tools",
                children: [
                  { id: "Chrome DevTools", label: "Chrome DevTools" },
                  {
                    id: "Firefox Developer Tools",
                    label: "Firefox Developer Tools",
                  },
                  { id: "Safari Web Inspector", label: "Safari Web Inspector" },
                ],
              },
              {
                id: "Testing Frameworks",
                label: "Testing Frameworks",
                children: [
                  { id: "Jest", label: "Jest" },
                  { id: "Mocha", label: "Mocha" },
                  { id: "Jasmine", label: "Jasmine" },
                  { id: "Chai", label: "Chai" },
                  { id: "Enzyme", label: "Enzyme" },
                ],
              },
              {
                id: "Continuous Integration/Continuous Deployment Tools",
                label: "Continuous Integration/Continuous Deployment Tools",
                children: [
                  { id: "Jenkins", label: "Jenkins" },
                  { id: "Travis CI", label: "Travis CI" },
                  { id: "CircleCI", label: "CircleCI" },
                  { id: "GitHub Actions", label: "GitHub Actions" },
                ],
              },
            ],
          },
          {
            id: "SEO",
            label: "SEO",
            children: [
              { id: "Keyword Research", label: "Keyword Research" },
              { id: "On-Page SEO", label: "On-Page SEO" },
              { id: "Off-Page SEO", label: "Off-Page SEO" },
              { id: "Technical SEO", label: "Technical SEO" },
              {
                id: "SEO Analytics and Reporting",
                label: "SEO Analytics and Reporting",
              },
              { id: "Local SEO", label: "Local SEO" },
              { id: "Mobile SEO", label: "Mobile SEO" },
              { id: "SEO Tools", label: "SEO Tools" },
            ],
          },
        ],
      },
      {
        id: "Artificial Intelligence",
        label: "Artificial Intelligence",
        children: [
          { id: "Machine Learning", label: "Machine Learning" },
          { id: "Deep Learning", label: "Deep Learning" },
          { id: "Neural Networks", label: "Neural Networks" },
          {
            id: "Natural Language Processing",
            label: "Natural Language Processing",
          },
          { id: "Computer Vision", label: "Computer Vision" },
          { id: "Reinforcement Learning", label: "Reinforcement Learning" },
          {
            id: "Artificial Intelligence Tools",
            label: "Artificial Intelligence Tools",
          },
        ],
      },
      {
        id: "Data Science",
        label: "Data Science",
        children: [
          { id: "Data Analysis", label: "Data Analysis" },
          { id: "Data Visualization", label: "Data Visualization" },
          { id: "Data Mining", label: "Data Mining" },
          { id: "Statistical Modeling", label: "Statistical Modeling" },
          { id: "Big Data Frameworks", label: "Big Data Frameworks" },
          {
            id: "Data Storage and Processing",
            label: "Data Storage and Processing",
          },
          {
            id: "Data Science and Big Data Tools",
            label: "Data Science and Big Data Tools",
          },
        ],
      },
      {
        id: "Computer Networking",
        label: "Computer Networking",
        children: [
          { id: "Network Protocols", label: "Network Protocols" },
          { id: "Network Architecture", label: "Network Architecture" },
          { id: "Routing and Switching", label: "Routing and Switching" },
          { id: "Wireless Networking", label: "Wireless Networking" },
          {
            id: "Network Monitoring and Troubleshooting",
            label: "Network Monitoring and Troubleshooting",
          },
        ],
      },
      {
        id: "Cybersecurity",
        label: "Cybersecurity",
        children: [
          { id: "Network Security", label: "Network Security" },
          { id: "Application Security", label: "Application Security" },
          { id: "Cryptography", label: "Cryptography" },
          { id: "Penetration Testing", label: "Penetration Testing" },
          { id: "Security Auditing", label: "Security Auditing" },
          { id: "Incident Response", label: "Incident Response" },
        ],
      },
      {
        id: "Cloud Computing",
        label: "Cloud Computing",
        children: [
          { id: "AWS", label: "AWS" },
          { id: "Azure", label: "Azure" },
          { id: "Google Cloud Platform", label: "Google Cloud Platform" },
          { id: "Serverless Computing", label: "Serverless Computing" },
          {
            id: "Containerization",
            label: "Containerization",
            children: [
              { id: "Docker", label: "Docker" },
              { id: "Kubernetes", label: "Kubernetes" },
              { id: "OpenShift", label: "OpenShift" },
            ],
          },
          { id: "Microservices", label: "Microservices" },
        ],
      },
      {
        id: "Operating Systems",
        label: "Operating Systems",
        children: [
          { id: "Windows", label: "Windows" },
          { id: "macOS", label: "macOS" },
          { id: "Linux", label: "Linux" },
          { id: "UNIX", label: "UNIX" },
          { id: "Mobile Operating Systems", label: "Mobile Operating Systems" },
        ],
      },
      {
        id: "Software Engineering",
        label: "Software Engineering",
        children: [
          {
            id: "Software Development Methodologies",
            label: "Software Development Methodologies",
          },
          { id: "Software Testing", label: "Software Testing" },
          {
            id: "User Interface (UI) and User Experience (UX) Design",
            label: "User Interface (UI) and User Experience (UX) Design",
          },
          {
            id: "IT Management and Support",
            label: "IT Management and Support",
          },
          {
            id: "Blockchain and Cryptocurrency",
            label: "Blockchain and Cryptocurrency",
          },
          {
            id: "UX/UI Design",
            label: "UX/UI Design",
            children: [
              { id: "Prototyping", label: "Prototyping" },
              { id: "User Research", label: "User Research" },
              {
                id: "Information Architecture",
                label: "Information Architecture",
              },
              { id: "Interaction Design", label: "Interaction Design" },
              { id: "Visual Design", label: "Visual Design" },
            ],
          },
          {
            id: "Agile Methodologies",
            label: "Agile Methodologies",
            children: [
              { id: "Scrum", label: "Scrum" },
              { id: "Kanban", label: "Kanban" },
              { id: "Lean", label: "Lean" },
              { id: "XP", label: "XP" },
            ],
          },
          {
            id: "Project Management",
            label: "Project Management",
            children: [
              { id: "Project Planning", label: "Project Planning" },
              { id: "Risk Management", label: "Risk Management" },
              { id: "Quality Management", label: "Quality Management" },
              { id: "Stakeholder Management", label: "Stakeholder Management" },
            ],
          },
          {
            id: "DevOps",
            label: "DevOps",
            children: [
              { id: "Continuous Integration", label: "Continuous Integration" },
              { id: "Continuous Deployment", label: "Continuous Deployment" },
              { id: "Infrastructure as Code", label: "Infrastructure as Code" },
              { id: "Monitoring and Logging", label: "Monitoring and Logging" },
            ],
          },
        ],
      },
      {
        id: "Computer Hardware",
        label: "Computer Hardware",
        children: [
          {
            id: "Processors and Architectures",
            label: "Processors and Architectures",
          },
          { id: "Memory and Storage", label: "Memory and Storage" },
          {
            id: "Peripherals and Interfaces",
            label: "Peripherals and Interfaces",
          },
          {
            id: "Power Supplies and Cooling",
            label: "Power Supplies and Cooling",
          },
          { id: "Networking Hardware", label: "Networking Hardware" },
          {
            id: "Computer Assembly and Troubleshooting",
            label: "Computer Assembly and Troubleshooting",
          },
        ],
      },
      {
        id: "Software Tools and IDEs",
        label: "Software Tools and IDEs",
        children: [
          { id: "Visual Studio", label: "Visual Studio" },
          { id: "IntelliJ IDEA", label: "IntelliJ IDEA" },
          { id: "PyCharm", label: "PyCharm" },
          { id: "Eclipse", label: "Eclipse" },
          { id: "Xcode", label: "Xcode" },
          { id: "Atom", label: "Atom" },
          { id: "VSCode", label: "VSCode" },
        ],
      },
      {
        id: "Other Topics",
        label: "Other Topics",
        children: [
          { id: "Artificial Life", label: "Artificial Life" },
          { id: "Computer Graphics", label: "Computer Graphics" },
          { id: "Scientific Computing", label: "Scientific Computing" },
          { id: "Game Development", label: "Game Development" },
        ],
      },
    ],
  },
  {
    id: "Education",
    label: "Education",
    children: [
      { id: "Early Childhood Education", label: "Early Childhood Education" },
      { id: "K-12 Education", label: "K-12 Education" },
      { id: "Higher Education", label: "Higher Education" },
      { id: "Special Education", label: "Special Education" },
      { id: "Educational Technology", label: "Educational Technology" },
      { id: "Teaching Methods", label: "Teaching Methods" },
    ],
  },
  {
    id: "Engineering",
    label: "Engineering",
    children: [
      { id: "Civil Engineering", label: "Civil Engineering" },
      { id: "Mechanical Engineering", label: "Mechanical Engineering" },
      { id: "Electrical Engineering", label: "Electrical Engineering" },
      { id: "Chemical Engineering", label: "Chemical Engineering" },
      { id: "Aerospace Engineering", label: "Aerospace Engineering" },
      { id: "Biomedical Engineering", label: "Biomedical Engineering" },
    ],
  },
  {
    id: "Health and Medicine",
    label: "Health and Medicine",
    children: [
      { id: "Medical Specialties", label: "Medical Specialties" },
      { id: "Nursing", label: "Nursing" },
      { id: "Pharmacy", label: "Pharmacy" },
      { id: "Dentistry", label: "Dentistry" },
      { id: "Public Health", label: "Public Health" },
      { id: "Nutrition and Dietetics", label: "Nutrition and Dietetics" },
    ],
  },
  {
    id: "Law",
    label: "Law",
    children: [
      { id: "Criminal Law", label: "Criminal Law" },
      { id: "Civil Law", label: "Civil Law" },
      { id: "Intellectual Property", label: "Intellectual Property" },
      { id: "Family Law", label: "Family Law" },
      { id: "Contract Law", label: "Contract Law" },
      { id: "International Law", label: "International Law" },
    ],
  },
  {
    id: "Mathematics",
    label: "Mathematics",
    children: [
      { id: "Algebra", label: "Algebra" },
      { id: "Geometry", label: "Geometry" },
      { id: "Calculus", label: "Calculus" },
      { id: "Probability and Statistics", label: "Probability and Statistics" },
      { id: "Applied Mathematics", label: "Applied Mathematics" },
      { id: "Discrete Mathematics", label: "Discrete Mathematics" },
    ],
  },
  {
    id: "Natural Sciences",
    label: "Natural Sciences",
    children: [
      { id: "Biology", label: "Biology" },
      { id: "Chemistry", label: "Chemistry" },
      { id: "Physics", label: "Physics" },
      { id: "Earth Science", label: "Earth Science" },
      { id: "Astronomy", label: "Astronomy" },
      { id: "Environmental Science", label: "Environmental Science" },
    ],
  },
  {
    id: "Social Sciences",
    label: "Social Sciences",
    children: [
      { id: "Anthropology", label: "Anthropology" },
      { id: "Economics", label: "Economics" },
      { id: "Political Science", label: "Political Science" },
      { id: "Psychology", label: "Psychology" },
      { id: "Sociology", label: "Sociology" },
      { id: "Human Geography", label: "Human Geography" },
    ],
  },
  {
    id: "Technology",
    label: "Technology",
    children: [
      { id: "Electronics", label: "Electronics" },
      { id: "Robotics", label: "Robotics" },
      { id: "Nanotechnology", label: "Nanotechnology" },
      { id: "Biotechnology", label: "Biotechnology" },
      { id: "Renewable Energy", label: "Renewable Energy" },
      { id: "Telecommunications", label: "Telecommunications" },
    ],
  },
  {
    id: "Vocational Skills",
    label: "Vocational Skills",
    children: [
      { id: "Automotive Repair", label: "Automotive Repair" },
      { id: "Plumbing", label: "Plumbing" },
      { id: "Carpentry", label: "Carpentry" },
      { id: "Welding", label: "Welding" },
      { id: "Culinary Arts", label: "Culinary Arts" },
    ],
  },
];

export const getFlatTopics = (topics: Topic_[], parent = ""): string[] => {
  let flatTopics: any[] = [];

  for (const topic of topics) {
    const path = parent ? `${parent}/${topic.name}` : topic.name;
    flatTopics.push(path);

    if (topic.subtopics) {
      flatTopics = flatTopics.concat(getFlatTopics(topic.subtopics, path));
    }
  }

  return flatTopics;
};

export const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas (the)",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia (Plurinational State of)",
  "Bonaire, Sint Eustatius and Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory (the)",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cayman Islands (the)",
  "Central African Republic (the)",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands (the)",
  "Colombia",
  "Comoros (the)",
  "Congo (the Democratic Republic of the)",
  "Congo (the)",
  "Cook Islands (the)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Curaçao",
  "Cyprus",
  "Czechia",
  "Côte d'Ivoire",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic (the)",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Falkland Islands (the) [Malvinas]",
  "Faroe Islands (the)",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories (the)",
  "Gabon",
  "Gambia (the)",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard Island and McDonald Islands",
  "Holy See (the)",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran (Islamic Republic of)",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea (the Democratic People's Republic of)",
  "Korea (the Republic of)",
  "Kuwait",
  "Kyrgyzstan",
  "Lao People's Democratic Republic (the)",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands (the)",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia (Federated States of)",
  "Moldova (the Republic of)",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands (the)",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger (the)",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands (the)",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine, State of",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines (the)",
  "Pitcairn",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Republic of North Macedonia",
  "Romania",
  "Russian Federation (the)",
  "Rwanda",
  "Réunion",
  "Saint Barthélemy",
  "Saint Helena, Ascension and Tristan da Cunha",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin (French part)",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten (Dutch part)",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and the South Sandwich Islands",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan (the)",
  "Suriname",
  "Svalbard and Jan Mayen",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Taiwan",
  "Tajikistan",
  "Tanzania, United Republic of",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands (the)",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates (the)",
  "United Kingdom of Great Britain and Northern Ireland (the)",
  "United States Minor Outlying Islands (the)",
  "United States of America (the)",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela (Bolivarian Republic of)",
  "Viet Nam",
  "Virgin Islands (British)",
  "Virgin Islands (U.S.)",
  "Wallis and Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe",
  "Åland Islands",
];

export const languages = [
  "Abkhaz",
  "Afar",
  "Afrikaans",
  "Akan",
  "Albanian",
  "Amharic",
  "Arabic",
  "Aragonese",
  "Armenian",
  "Assamese",
  "Avaric",
  "Avestan",
  "Aymara",
  "Azerbaijani",
  "Bambara",
  "Bashkir",
  "Basque",
  "Belarusian",
  "Bengali",
  "Bihari",
  "Bislama",
  "Bosnian",
  "Breton",
  "Bulgarian",
  "Burmese",
  "Catalan; Valencian",
  "Chamorro",
  "Chechen",
  "Chichewa; Chewa; Nyanja",
  "Chinese",
  "Chuvash",
  "Cornish",
  "Corsican",
  "Cree",
  "Croatian",
  "Czech",
  "Danish",
  "Divehi; Dhivehi; Maldivian;",
  "Dutch",
  "English",
  "Esperanto",
  "Estonian",
  "Ewe",
  "Faroese",
  "Fijian",
  "Finnish",
  "French",
  "Fula; Fulah; Pulaar; Pular",
  "Galician",
  "Georgian",
  "German",
  "Greek, Modern",
  "Guaraní",
  "Gujarati",
  "Haitian; Haitian Creole",
  "Hausa",
  "Hebrew (modern)",
  "Herero",
  "Hindi",
  "Hiri Motu",
  "Hungarian",
  "Interlingua",
  "Indonesian",
  "Interlingue",
  "Irish",
  "Igbo",
  "Inupiaq",
  "Ido",
  "Icelandic",
  "Italian",
  "Inuktitut",
  "Japanese",
  "Javanese",
  "Kalaallisut, Greenlandic",
  "Kannada",
  "Kanuri",
  "Kashmiri",
  "Kazakh",
  "Khmer",
  "Kikuyu, Gikuyu",
  "Kinyarwanda",
  "Kirghiz, Kyrgyz",
  "Komi",
  "Kongo",
  "Korean",
  "Kurdish",
  "Kwanyama, Kuanyama",
  "Latin",
  "Luxembourgish, Letzeburgesch",
  "Luganda",
  "Limburgish, Limburgan, Limburger",
  "Lingala",
  "Lao",
  "Lithuanian",
  "Luba-Katanga",
  "Latvian",
  "Manx",
  "Macedonian",
  "Malagasy",
  "Malay",
  "Malayalam",
  "Maltese",
  "Māori",
  "Marathi (Marāṭhī)",
  "Marshallese",
  "Mongolian",
  "Nauru",
  "Navajo, Navaho",
  "Norwegian Bokmål",
  "North Ndebele",
  "Nepali",
  "Ndonga",
  "Norwegian Nynorsk",
  "Norwegian",
  "Nuosu",
  "South Ndebele",
  "Occitan",
  "Ojibwe, Ojibwa",
  "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
  "Oromo",
  "Oriya",
  "Ossetian, Ossetic",
  "Panjabi, Punjabi",
  "Pāli",
  "Persian",
  "Polish",
  "Pashto, Pushto",
  "Portuguese",
  "Quechua",
  "Romansh",
  "Kirundi",
  "Romanian, Moldavian, Moldovan",
  "Russian",
  "Sanskrit (Saṁskṛta)",
  "Sardinian",
  "Sindhi",
  "Northern Sami",
  "Samoan",
  "Sango",
  "Serbian",
  "Scottish Gaelic; Gaelic",
  "Shona",
  "Sinhala, Sinhalese",
  "Slovak",
  "Slovene",
  "Somali",
  "Southern Sotho",
  "Spanish; Castilian",
  "Sundanese",
  "Swahili",
  "Swati",
  "Swedish",
  "Tamil",
  "Telugu",
  "Tajik",
  "Thai",
  "Tigrinya",
  "Tibetan Standard, Tibetan, Central",
  "Turkmen",
  "Tagalog",
  "Tswana",
  "Tonga (Tonga Islands)",
  "Turkish",
  "Tsonga",
  "Tatar",
  "Twi",
  "Tahitian",
  "Uighur, Uyghur",
  "Ukrainian",
  "Urdu",
  "Uzbek",
  "Venda",
  "Vietnamese",
  "Volapük",
  "Walloon",
  "Welsh",
  "Wolof",
  "Western Frisian",
  "Xhosa",
  "Yiddish",
  "Yoruba",
  "Zhuang, Chuang",
];
