module.exports = {
  seo: {
    '/': {
      title: 'GYC Sierra Leone | Youth-Led Sustainable Development Organization',
      description: 'Global Youth Counterpart for Sustainable Development (GYC) Sierra Leone empowers young people to lead climate action, achieve the SDGs, and create lasting change. Join our movement!',
      keywords: 'youth empowerment Sierra Leone, sustainable development NGO Sierra Leone, climate action youth Africa, SDG youth organization'
    },
    '/about': {
      title: 'About GYC Sierra Leone | Our Mission, Vision & Team',
      description: 'Learn about GYC Sierra Leone - a youth-led NGO mobilizing young people for sustainable development since 2017. Discover our vision, mission, team, and partners.'
    },
    '/programs': {
      title: 'Our Programs | Climate, SDGs, Gender & Youth Empowerment | GYC Sierra Leone',
      description: 'Explore GYC?s programs in climate action, SDG advocacy, gender equality, youth employment, and civic engagement. Building young leaders for sustainable development.'
    },
    '/projects': {
      title: 'Projects | Youth-Led Initiatives Across Sierra Leone | GYC',
      description: 'Discover GYC?s projects making a difference in communities across Sierra Leone. From climate adaptation to women?s empowerment, see our impact.'
    },
    '/get-involved': {
      title: 'Get Involved | Volunteer, Partner & Donate | GYC Sierra Leone',
      description: 'Join the GYC movement! Volunteer your time, partner with us, or donate to support youth empowerment and sustainable development in Sierra Leone.'
    },
    '/news': {
      title: 'News & Events | Latest Updates from GYC Sierra Leone',
      description: 'Stay updated with GYC Sierra Leone?s latest news, upcoming events, press releases, and impact stories from our work across the country.'
    },
    '/contact': {
      title: 'Contact Us | GYC Sierra Leone',
      description: 'Get in touch with GYC Sierra Leone. Contact us for partnerships, volunteering, media inquiries, or general questions. We?d love to hear from you!'
    },
    default: {
      title: 'GYC Sierra Leone',
      description: 'Youth-led sustainable development organisation in Sierra Leone.'
    }
  },
  pages: [
    {
      route_path: '/',
      title: 'Home',
      hero_title: 'Building an Emerging Society of Young Leaders for Sustainable Development',
      hero_subtitle: 'Empowering Sierra Leone?s youth to lead climate action, achieve the SDGs, and create lasting change in their communities.',
      sections: [
        {
          section_key: 'hero',
          title: 'Building an Emerging Society of Young Leaders for Sustainable Development',
          subtitle: 'Empowering Sierra Leone?s youth to lead climate action, achieve the SDGs, and create lasting change in their communities.',
          body: 'Dynamic image of diverse young Sierra Leoneans in action, from climate activities to community engagement and conference settings.',
          cta_label: 'Join the Movement',
          cta_link: '/get-involved',
          secondary_cta_label: 'Learn More',
          secondary_cta_link: '/about',
          layout_style: 'hero',
          sort_order: 1
        },
        {
          section_key: 'impact-statistics',
          title: 'Impact Statistics',
          subtitle: 'Animated counters displaying key impact numbers',
          body: JSON.stringify([
            { label: 'Youth Reached', value: '5,000+', description: 'Young people mobilized across Sierra Leone' },
            { label: 'Districts Covered', value: '6', description: 'National presence in 6 districts' },
            { label: 'Projects Implemented', value: '25+', description: 'Community-based initiatives completed' },
            { label: 'Young Women Trained', value: '500+', description: 'In leadership, economic empowerment and climate literacy' },
            { label: 'Years of Impact', value: '9+', description: 'Since establishment in 2017' }
          ]),
          layout_style: 'stats',
          sort_order: 2
        },
        {
          section_key: 'about-preview',
          title: 'Who We Are',
          subtitle: 'About Us Preview',
          body: 'The Global Youth Counterpart for Sustainable Development (GYC) Sierra Leone is a youth-led organization committed to mobilizing young people for the achievement of the Sustainable Development Goals. We believe that young people are not just future leaders, they are present-day architects of sustainable solutions. Since 2017, we have worked at the intersection of youth empowerment, climate action, and gender equality.',
          cta_label: 'Discover Our Story',
          cta_link: '/about',
          layout_style: 'feature',
          sort_order: 3
        },
        {
          section_key: 'programs-overview',
          title: 'What We Do',
          subtitle: 'We work across five interconnected thematic areas to create lasting impact.',
          body: 'Climate Action & Environment; SDG Advocacy & Localization; Gender Equality & Women?s Empowerment; Youth Employment & Entrepreneurship; Good Governance & Civic Engagement',
          cta_label: 'Explore Our Programs',
          cta_link: '/programs',
          layout_style: 'cards',
          sort_order: 4
        },
        {
          section_key: 'featured-news-project',
          title: 'Latest News & Updates',
          subtitle: 'Featured project and latest updates',
          body: 'Featured event: Youth Adaptation & SDGs Leadership Conference 2026. Featured project: Local Waste to Treasure in Kolleh Town Community.',
          cta_label: 'View All News',
          cta_link: '/news',
          layout_style: 'featured',
          sort_order: 5
        },
        {
          section_key: 'partners-supporters',
          title: 'Our Partners & Supporters',
          subtitle: 'Government, UN agencies, INGOs, and local partners',
          body: 'Government: Ministry of Youth Affairs, Ministry of Environment, National Youth Commission. UN: UNDP, UNICEF, UN Women. INGOs: Plan International, ActionAid, Restless Development. Local: Sunrise Movement SL, SKOVE, RWCDO.',
          cta_label: 'Partner With Us',
          cta_link: '/get-involved/partner',
          layout_style: 'logos',
          sort_order: 6
        },
        {
          section_key: 'final-cta',
          title: 'Ready to Make a Difference?',
          subtitle: 'Join thousands of young Sierra Leoneans who are taking action for a sustainable future.',
          body: 'Whether you volunteer, partner, or donate, your contribution matters.',
          cta_label: 'Volunteer',
          cta_link: '/get-involved/volunteer',
          secondary_cta_label: 'Partner',
          secondary_cta_link: '/get-involved/partner',
          layout_style: 'cta-banner',
          sort_order: 7
        }
      ]
    },
    {
      route_path: '/about',
      title: 'About Us',
      hero_title: 'The youth-led organisation mobilizing young people for sustainable development',
      hero_subtitle: 'Founded in 2017, GYC emerged from the recognition that Sierra Leone?s youthful population must be at the forefront of sustainable development efforts.',
      sections: [
        {
          section_key: 'who-we-are',
          title: 'Who We Are',
          subtitle: 'Youth-led, youth-driven, intersectional, and evidence-based',
          body: 'The Global Youth Counterpart for Sustainable Development (GYC) Sierra Leone is a youth-led non-governmental organization dedicated to mobilizing, empowering, and connecting young people across Sierra Leone for the achievement of the SDGs. We combine national advocacy with grassroots action and maintain the highest standards of governance and accountability.',
          layout_style: 'content',
          sort_order: 1
        }
      ]
    },
    {
      route_path: '/about/our-story',
      title: 'Our Story',
      hero_title: 'Our Story',
      hero_subtitle: 'From a youth-led idea in 2017 to a recognized national voice for sustainable development.',
      sections: [
        {
          section_key: 'origins',
          title: 'The Beginning (2017)',
          body: 'GYC Sierra Leone was born from a simple but powerful idea: that young people must be architects, not spectators, of sustainable development.',
          layout_style: 'content',
          sort_order: 1
        },
        {
          section_key: 'momentum',
          title: 'Building Momentum (2019-2021)',
          body: 'Through community mobilizations, SDG awareness campaigns, and youth leadership training, we began building a movement.',
          layout_style: 'content',
          sort_order: 2
        },
        {
          section_key: 'impact',
          title: 'Growing Impact (2022-Present)',
          body: 'Mobilized over 5,000 young people across all 16 districts, trained 500+ youth and young women, partnered widely, contributed to policy dialogues, and implemented 25+ community-based projects.',
          layout_style: 'content',
          sort_order: 3
        }
      ]
    },
    {
      route_path: '/about/vision-mission',
      title: 'Vision, Mission & Values',
      hero_title: 'Vision, Mission & Core Values',
      hero_subtitle: 'The principles that guide GYC?s work across Sierra Leone.',
      sections: [
        {
          section_key: 'vision',
          title: 'Our Vision',
          body: 'A world where young people are empowered, informed, and actively leading the achievement of sustainable development, climate resilience, and social justice for present and future generations.',
          layout_style: 'content',
          sort_order: 1
        },
        {
          section_key: 'mission',
          title: 'Our Mission',
          body: 'To mobilize, empower, and connect young people across Sierra Leone for the achievement of the SDGs through advocacy, capacity building, community action, and strategic partnerships that promote youth leadership, gender equality, climate action, and inclusive development.',
          layout_style: 'content',
          sort_order: 2
        },
        {
          section_key: 'values',
          title: 'Core Values',
          body: 'Youth Leadership; Inclusion & Equity; Innovation; Integrity; Collaboration.',
          layout_style: 'content',
          sort_order: 3
        }
      ]
    },
    {
      route_path: '/about/team',
      title: 'Our Team',
      hero_title: 'Meet the People Behind GYC',
      hero_subtitle: 'Our team combines youth energy with professional expertise.',
      sections: [
        {
          section_key: 'leadership-team',
          title: 'Leadership Team',
          body: 'Executive Director, Head of Programs, Finance & Administration Officer, and MEAL Officer profiles are editable from dedicated team records.',
          layout_style: 'team-grid',
          sort_order: 1
        },
        {
          section_key: 'board',
          title: 'Board of Directors',
          body: 'Board Chair, Vice Chair, Treasurer, Secretary, and Board Members provide strategic oversight and governance.',
          layout_style: 'list',
          sort_order: 2
        },
        {
          section_key: 'district-coordinators',
          title: 'District Coordinators',
          body: 'Volunteer coordinators ensure grassroots reach across districts.',
          cta_label: 'View Open Positions',
          cta_link: '/get-involved/volunteer',
          layout_style: 'list',
          sort_order: 3
        }
      ]
    },
    {
      route_path: '/about/partners',
      title: 'Partners & Networks',
      hero_title: 'Partners & Networks',
      hero_subtitle: 'Our impact is amplified through strategic partnerships and coalitions.',
      sections: [
        {
          section_key: 'partners',
          title: 'Our Partners',
          body: 'Government partners, UN agencies, international NGOs, local civil society partners, networks, and academic partners are managed from the partners module.',
          cta_label: 'Partner With Us',
          cta_link: '/get-involved/partner',
          layout_style: 'logos',
          sort_order: 1
        }
      ]
    },
    {
      route_path: '/programs',
      title: 'Programs',
      hero_title: 'Five interconnected thematic pillars',
      hero_subtitle: 'GYC works at the intersection of youth empowerment, climate action, gender equality, and sustainable development.',
      sections: [
        {
          section_key: 'programs-overview',
          title: 'Programs Overview',
          body: 'Our work is organized around five interconnected thematic pillars, each contributing to our overall goal of building a generation of young leaders for sustainable development.',
          layout_style: 'cards',
          sort_order: 1
        }
      ]
    },
    {
      route_path: '/programs/climate-action',
      title: 'Climate Action & Environmental Sustainability',
      hero_title: 'Climate Action & Environmental Sustainability',
      hero_subtitle: 'Youth-led climate adaptation, environmental awareness, and green innovation.',
      sections: [
        { section_key: 'challenge', title: 'The Challenge', body: 'Sierra Leone is ranked among the world?s most climate-vulnerable nations. Rising sea levels threaten coastal communities, deforestation destroys livelihoods, and erratic rainfall patterns devastate agriculture.', layout_style: 'content', sort_order: 1 },
        { section_key: 'approach', title: 'Our Approach', body: 'We believe young people must be architects of climate solutions, not passive victims. Our climate programming combines awareness-raising, skills-building, and practical action to build youth adaptive capacity.', layout_style: 'content', sort_order: 2 },
        { section_key: 'activities', title: 'Key Activities', body: 'Climate literacy training; youth adaptation projects; tree planting and reforestation; green innovation incubation; climate policy advocacy; environmental awareness campaigns.', layout_style: 'list', sort_order: 3 },
        { section_key: 'impact', title: 'Impact Highlights', body: '500+ youth trained in climate literacy; 10,000+ trees planted; 15+ community adaptation projects implemented; youth representatives at COP and national climate dialogues.', layout_style: 'stats', sort_order: 4 },
        { section_key: 'featured-project', title: 'Featured Project', body: 'Youth Adaptation & SDGs Leadership Conference: Our flagship annual conference brings together 100+ young climate leaders to build skills, share innovations, and develop action plans.', layout_style: 'feature', sort_order: 5 }
      ]
    },
    {
      route_path: '/programs/sdg-advocacy',
      title: 'SDG Advocacy & Localization',
      hero_title: 'SDG Advocacy & Localization',
      hero_subtitle: 'Community-based SDG implementation and policy advocacy.',
      sections: [
        { section_key: 'challenge', title: 'The Challenge', body: 'With less than five years remaining, progress on many SDGs is off track. Young people often lack awareness of the SDGs and opportunities to contribute to their implementation.', layout_style: 'content', sort_order: 1 },
        { section_key: 'approach', title: 'Our Approach', body: 'We work to make the SDGs real and actionable for young Sierra Leoneans through education, community projects, and policy advocacy.', layout_style: 'content', sort_order: 2 },
        { section_key: 'activities', title: 'Key Activities', body: 'SDG awareness campaigns; youth SDG ambassadors; community SDG projects; SDG localization; policy advocacy; SDG monitoring.', layout_style: 'list', sort_order: 3 },
        { section_key: 'focus-sdgs', title: 'SDGs We Focus On', body: 'SDG 4, SDG 5, SDG 8, SDG 13, SDG 16, SDG 17.', layout_style: 'badges', sort_order: 4 }
      ]
    },
    {
      route_path: '/programs/gender-equality',
      title: 'Gender Equality & Women?s Empowerment',
      hero_title: 'Gender Equality & Women?s Empowerment',
      hero_subtitle: 'Young women?s leadership development, economic empowerment, and gender-responsive programming.',
      sections: [
        { section_key: 'challenge', title: 'The Challenge', body: 'Women and girls face persistent barriers to education, economic opportunity, and leadership. Young women are particularly vulnerable to climate impacts while being underrepresented in decision-making.', layout_style: 'content', sort_order: 1 },
        { section_key: 'approach', title: 'Our Approach', body: 'We mainstream gender across all our programming while implementing targeted initiatives for young women?s empowerment.', layout_style: 'content', sort_order: 2 },
        { section_key: 'activities', title: 'Key Activities', body: 'Young Women?s Leadership Programme; International Women?s Day commemoration; gender-responsive climate programming; Girls in STEM; advocacy against GBV; mentorship networks.', layout_style: 'list', sort_order: 3 },
        { section_key: 'impact', title: 'Impact Highlights', body: '200+ young women trained; 50% female participation target across all programs; annual IWD events reaching 200+ participants; framework developed.', layout_style: 'stats', sort_order: 4 }
      ]
    },
    {
      route_path: '/programs/youth-employment',
      title: 'Youth Employment & Entrepreneurship',
      hero_title: 'Youth Employment & Entrepreneurship',
      hero_subtitle: 'Green jobs, skills training, and enterprise development support.',
      sections: [
        { section_key: 'challenge', title: 'The Challenge', body: 'Youth unemployment in Sierra Leone exceeds 60%, yet the green economy presents enormous untapped opportunities. Young people lack access to skills, finance, and markets needed to build sustainable livelihoods.', layout_style: 'content', sort_order: 1 },
        { section_key: 'approach', title: 'Our Approach', body: 'We connect youth to economic opportunities in the green economy while building skills for sustainable livelihoods.', layout_style: 'content', sort_order: 2 },
        { section_key: 'activities', title: 'Key Activities', body: 'Green skills training; youth enterprise development; business mentorship; linkages to finance; market access; vocational skills support.', layout_style: 'list', sort_order: 3 },
        { section_key: 'opportunities', title: 'Green Economy Opportunities', body: 'Renewable energy; sustainable agriculture; waste management and recycling; eco-tourism; environmental consulting.', layout_style: 'list', sort_order: 4 }
      ]
    },
    {
      route_path: '/programs/governance',
      title: 'Good Governance & Civic Engagement',
      hero_title: 'Good Governance & Civic Engagement',
      hero_subtitle: 'Youth participation in governance and accountability monitoring.',
      sections: [
        { section_key: 'challenge', title: 'The Challenge', body: 'Despite progressive policies, youth participation in governance remains limited. Young people are often excluded from decisions that shape their futures.', layout_style: 'content', sort_order: 1 },
        { section_key: 'approach', title: 'Our Approach', body: 'We create platforms for meaningful youth participation in governance while building civic competencies. We believe democracy is strengthened when young people engage actively.', layout_style: 'content', sort_order: 2 },
        { section_key: 'activities', title: 'Key Activities', body: 'Civic education; youth-policymaker dialogues; voter awareness; policy advocacy; accountability monitoring; youth representation.', layout_style: 'list', sort_order: 3 },
        { section_key: 'policy-engagement', title: 'Policy Engagement', body: 'MTNDP 2024-2030 consultations; National Youth Policy review; Climate Change Policy development; SDG implementation monitoring.', layout_style: 'list', sort_order: 4 }
      ]
    },
    {
      route_path: '/get-involved',
      title: 'Get Involved',
      hero_title: 'Join the Movement',
      hero_subtitle: 'There are many ways to be part of GYC?s work.',
      sections: [
        {
          section_key: 'get-involved-intro',
          title: 'Join the Movement',
          body: 'Whether you have time, skills, resources, or ideas, we welcome your contribution to building a sustainable Sierra Leone.',
          layout_style: 'content',
          sort_order: 1
        }
      ]
    },
    {
      route_path: '/get-involved/volunteer',
      title: 'Volunteer With Us',
      hero_title: 'Volunteer With Us',
      hero_subtitle: 'Make a real difference in your community while building valuable skills and experience.',
      sections: [
        {
          section_key: 'why-volunteer',
          title: 'Why Volunteer?',
          body: 'Make a real difference in your community; build valuable skills and experience; connect with like-minded young changemakers; contribute to the SDGs and climate action; gain references and networking opportunities.',
          cta_label: 'Apply to Volunteer',
          cta_link: '/get-involved/volunteer',
          layout_style: 'content',
          sort_order: 1
        }
      ]
    },
    {
      route_path: '/get-involved/partner',
      title: 'Partner With Us',
      hero_title: 'Partnership Opportunities',
      hero_subtitle: 'We welcome partnerships with organizations that share our commitment to youth empowerment, climate action, and sustainable development.',
      sections: [
        {
          section_key: 'partnership-types',
          title: 'Types of Partnerships',
          body: 'Programme Partnerships; Knowledge Partnerships; Event Partnerships; Capacity Building Partnerships; Corporate Partnerships.',
          cta_label: 'Explore Partnership',
          cta_link: '/get-involved/partner',
          layout_style: 'content',
          sort_order: 1
        }
      ]
    },
    {
      route_path: '/donate',
      title: 'Donate',
      hero_title: 'Support Our Work',
      hero_subtitle: 'Your donation enables GYC to continue empowering young Sierra Leoneans to lead on climate, sustainable development, and gender equality.',
      sections: [
        {
          section_key: 'donation-levels',
          title: 'How Your Donation Helps',
          body: '$25 training materials; $50 youth climate awareness session; $100 young woman leadership workshop; $250 youth delegate sponsorship; $500 mini-project funding; $1,000+ district mobilization campaign.',
          layout_style: 'content',
          sort_order: 1
        },
        {
          section_key: 'ways-to-give',
          title: 'Ways to Give',
          body: 'Online donation, bank transfer, mobile money, and in-kind donations.',
          layout_style: 'content',
          sort_order: 2
        }
      ]
    },
    {
      route_path: '/news',
      title: 'News & Events',
      hero_title: 'Latest Updates',
      hero_subtitle: 'Stay informed about GYC?s activities, events, and impact stories.',
      sections: [
        {
          section_key: 'news-overview',
          title: 'News Grid',
          body: 'Upcoming events, recent news, press releases, and newsletter signup.',
          layout_style: 'news-grid',
          sort_order: 1
        }
      ]
    },
    {
      route_path: '/resources',
      title: 'Resources',
      hero_title: 'Knowledge Hub',
      hero_subtitle: 'Access publications, toolkits, and learning materials from GYC?s work.',
      sections: [
        {
          section_key: 'resource-categories',
          title: 'Resource Categories',
          body: 'Publications; Toolkits & Guides; Multimedia; External Resources.',
          layout_style: 'content',
          sort_order: 1
        }
      ]
    },
    {
      route_path: '/gallery',
      title: 'Gallery',
      hero_title: 'Our Work in Pictures',
      hero_subtitle: 'Explore photos and videos from GYC?s activities across Sierra Leone.',
      sections: [
        {
          section_key: 'gallery-overview',
          title: 'Gallery Categories',
          body: 'Conferences & Events; Community Activities; Training & Workshops; Climate Action; Women?s Empowerment; Youth Advocacy; Team & Partners.',
          layout_style: 'gallery',
          sort_order: 1
        }
      ]
    },
    {
      route_path: '/contact',
      title: 'Contact Us',
      hero_title: 'Get in Touch',
      hero_subtitle: 'We?d love to hear from you. Whether you have questions, want to partner, or just want to connect, reach out to us.',
      sections: [
        {
          section_key: 'contact-form',
          title: 'Contact Form',
          body: 'Full Name, Email Address, Phone Number, Organization, Subject, and Message.',
          layout_style: 'form',
          sort_order: 1
        },
        {
          section_key: 'contact-map',
          title: 'Location Map',
          body: 'Embedded Google Map showing office location.',
          layout_style: 'map',
          sort_order: 2
        }
      ]
    }
  ],
  programs: [
    {
      title: 'Climate Action & Environmental Sustainability',
      slug: 'climate-action',
      short_description: 'Youth-led climate adaptation, environmental awareness, and green innovation.',
      challenge_text: 'Sierra Leone is among the world?s most climate-vulnerable nations, while young people are often excluded from climate decision-making.',
      approach_text: 'We combine awareness-raising, skills-building, and practical action to build youth adaptive capacity.',
      key_activities: 'Climate literacy training; youth adaptation projects; tree planting and reforestation; green innovation incubation; climate policy advocacy; environmental awareness campaigns.',
      impact_highlights: '500+ youth trained in climate literacy; 10,000+ trees planted; 15+ community adaptation projects; youth representatives at COP and national climate dialogues.',
      featured_project_title: 'Youth Adaptation & SDGs Leadership Conference',
      accent_color: '#56c02b',
      sort_order: 1
    },
    {
      title: 'SDG Advocacy & Localization',
      slug: 'sdg-advocacy',
      short_description: 'Community-based SDG implementation and policy advocacy.',
      challenge_text: 'Progress on many SDGs is off track, and young people often lack awareness of the Goals and opportunities to contribute.',
      approach_text: 'We make the SDGs real and actionable for young Sierra Leoneans through education, community projects, and policy advocacy.',
      key_activities: 'SDG awareness campaigns; youth SDG ambassadors; community SDG projects; localization; policy advocacy; SDG monitoring.',
      impact_highlights: 'Focus on SDGs 4, 5, 8, 13, 16, and 17.',
      accent_color: '#0a97d9',
      sort_order: 2
    },
    {
      title: 'Gender Equality & Women?s Empowerment',
      slug: 'gender-equality',
      short_description: 'Leadership development, economic empowerment, and gender-responsive programming.',
      challenge_text: 'Women and girls face persistent barriers to education, economic opportunity, and leadership, while being underrepresented in climate and development decision-making.',
      approach_text: 'We mainstream gender across all programming while implementing targeted initiatives for young women?s empowerment.',
      key_activities: 'Young women?s leadership programme; IWD events; gender-responsive climate programming; girls in STEM; advocacy against GBV; mentorship networks.',
      impact_highlights: '200+ young women trained; 50% female participation target; annual IWD events reaching 200+ participants.',
      accent_color: '#ff3a21',
      sort_order: 3
    },
    {
      title: 'Youth Employment & Entrepreneurship',
      slug: 'youth-employment',
      short_description: 'Green jobs, skills training, and enterprise development support.',
      challenge_text: 'Youth unemployment exceeds 60%, yet the green economy presents major untapped opportunities.',
      approach_text: 'We connect youth to economic opportunities in the green economy while building skills for sustainable livelihoods.',
      key_activities: 'Green skills training; enterprise development; business mentorship; finance linkages; market access; vocational skills support.',
      impact_highlights: 'Focus areas include renewable energy, sustainable agriculture, waste management, eco-tourism, and environmental consulting.',
      accent_color: '#fd6925',
      sort_order: 4
    },
    {
      title: 'Good Governance & Civic Engagement',
      slug: 'governance',
      short_description: 'Youth participation in governance and accountability monitoring.',
      challenge_text: 'Youth participation in governance remains limited, and civic space for youth advocacy needs strengthening.',
      approach_text: 'We create platforms for meaningful youth participation in governance while building civic competencies.',
      key_activities: 'Civic education; youth-policymaker dialogues; voter awareness; policy advocacy; accountability monitoring; youth representation.',
      impact_highlights: 'Contributed to MTNDP 2024-2030 consultations, National Youth Policy review, Climate Change Policy development, and SDG monitoring.',
      accent_color: '#19486a',
      sort_order: 5
    }
  ],
  projects: [
    {
      title: 'Youth Adaptation & SDGs Leadership Conference 2026',
      slug: 'youth-adaptation-sdgs-leadership-conference-2026',
      summary: 'A transformative two-day conference convening 100 young leaders to co-create frameworks for youth-led climate adaptation.',
      body: 'March 7-8, 2026 | Freetown, Sierra Leone. Aligned with International Women?s Day and focused on climate adaptation capacity building and SDG advocacy.',
      theme: 'Climate Action, Gender',
      location: 'National',
      project_status: 'current',
      partners_text: 'Sunrise Movement Sierra Leone',
      sort_order: 1
    },
    {
      title: 'Community Climate Adaptation Initiative',
      slug: 'community-climate-adaptation-initiative',
      summary: 'Supporting community-based climate adaptation through youth-led vulnerability assessments and resilience-building activities.',
      body: 'Ongoing project in Western Area and Koinadugu.',
      theme: 'Climate Action',
      location: 'Western Area, Koinadugu',
      project_status: 'ongoing',
      partners_text: '[Partner Names]',
      sort_order: 2
    },
    {
      title: 'Young Women?s Leadership Academy',
      slug: 'young-womens-leadership-academy',
      summary: 'An intensive leadership development programme for young women focused on advocacy, public speaking, project management, and climate leadership.',
      body: 'Ongoing national project.',
      theme: 'Gender Equality',
      location: 'National',
      project_status: 'ongoing',
      partners_text: '[Partner Names]',
      sort_order: 3
    }
  ],
  news: [
    {
      title: 'Youth Adaptation & SDGs Leadership Conference 2026',
      slug: 'youth-adaptation-sdgs-leadership-conference-2026-news',
      category: 'events',
      excerpt: 'Join 100 young leaders for climate adaptation capacity building and SDG advocacy.',
      body: 'March 7-8, 2026 in Freetown, Sierra Leone, as part of International Women?s Day commemoration.',
      published_at: '2026-03-07 09:00:00',
      author_name: 'GYC Sierra Leone',
      is_featured: 1,
      sort_order: 1
    },
    {
      title: 'GYC Launches 2026 Climate Youth Ambassador Programme',
      slug: 'gyc-launches-2026-climate-youth-ambassador-programme',
      category: 'news',
      excerpt: 'A sample article seeded from the official content plan.',
      body: 'Latest updates and impact stories will be managed through the news module.',
      published_at: '2026-01-15 09:00:00',
      author_name: 'GYC Sierra Leone',
      sort_order: 2
    }
  ],
  resources: [
    { title: 'Annual Reports (2017-2025)', slug: 'annual-reports-2017-2025', category: 'publications', summary: 'Annual organisational reports.', sort_order: 1 },
    { title: 'Youth Climate Adaptation Toolkit', slug: 'youth-climate-adaptation-toolkit', category: 'toolkits-guides', summary: 'Practical youth climate adaptation guide.', sort_order: 2 },
    { title: 'Project Documentary Videos', slug: 'project-documentary-videos', category: 'multimedia', summary: 'Video documentaries of projects.', sort_order: 3 },
    { title: 'UN SDG Resources', slug: 'un-sdg-resources', category: 'external-resources', summary: 'External links to UN SDG materials.', sort_order: 4 }
  ],
  partners: [
    { name: 'Ministry of Youth Affairs', slug: 'ministry-of-youth-affairs', partner_type: 'government', sort_order: 1 },
    { name: 'UNDP', slug: 'undp', partner_type: 'un-agency', sort_order: 2 },
    { name: 'UNICEF', slug: 'unicef', partner_type: 'un-agency', sort_order: 3 },
    { name: 'UN Women', slug: 'un-women', partner_type: 'un-agency', sort_order: 4 },
    { name: 'Plan International Sierra Leone', slug: 'plan-international-sierra-leone', partner_type: 'ingo', sort_order: 5 },
    { name: 'ActionAid Sierra Leone', slug: 'actionaid-sierra-leone', partner_type: 'ingo', sort_order: 6 },
    { name: 'Restless Development', slug: 'restless-development', partner_type: 'ingo', sort_order: 7 },
    { name: 'Sunrise Movement Sierra Leone', slug: 'sunrise-movement-sierra-leone', partner_type: 'local-partner', sort_order: 8 },
    { name: 'Skills for Vocational Empowerment (SKOVE)', slug: 'skills-for-vocational-empowerment-skove', partner_type: 'local-partner', sort_order: 9 },
    { name: 'Rural Women for Community Development Organization (RWCDO)', slug: 'rwcdo', partner_type: 'local-partner', sort_order: 10 }
  ],
  team: [
    { full_name: '[Name]', slug: 'executive-director', role_title: 'Executive Director', bio: '[Brief bio - 2-3 sentences about background, expertise, and passion for youth development]', email: 'ed@gycsl.org', linkedin_url: '[Profile Link]', sort_order: 1 },
    { full_name: '[Name]', slug: 'head-of-programs', role_title: 'Head of Programs', bio: '[Brief bio]', email: 'programmes@gycsl.org', sort_order: 2 },
    { full_name: '[Name]', slug: 'finance-administration-officer', role_title: 'Finance & Administration Officer', bio: '[Brief bio]', email: 'finance@gycsl.org', sort_order: 3 },
    { full_name: '[Name]', slug: 'meal-officer', role_title: 'MEAL Officer', bio: '[Brief bio]', email: 'communications@gycsl.org', sort_order: 4 }
  ],
  board: [
    { full_name: '[Name]', slug: 'board-chair', role_title: 'Board Chair', bio: '[Brief description]', sort_order: 1 },
    { full_name: '[Name]', slug: 'vice-chair', role_title: 'Vice Chair', bio: '[Brief description]', sort_order: 2 },
    { full_name: '[Name]', slug: 'treasurer', role_title: 'Treasurer', bio: '[Brief description]', sort_order: 3 },
    { full_name: '[Name]', slug: 'secretary', role_title: 'Secretary', bio: '[Brief description]', sort_order: 4 }
  ],
  districts: [
    { full_name: 'Volunteer Network', slug: 'volunteer-network-western-area', district_name: 'Western Area', sort_order: 1 },
    { full_name: 'Volunteer Network', slug: 'volunteer-network-koinadugu', district_name: 'Koinadugu', sort_order: 2 },
    { full_name: 'Volunteer Network', slug: 'volunteer-network-bo', district_name: 'Bo', sort_order: 3 },
    { full_name: 'Volunteer Network', slug: 'volunteer-network-kenema', district_name: 'Kenema', sort_order: 4 },
    { full_name: 'Volunteer Network', slug: 'volunteer-network-bombali', district_name: 'Bombali', sort_order: 5 },
    { full_name: 'Volunteer Network', slug: 'volunteer-network-port-loko', district_name: 'Port Loko', sort_order: 6 }
  ],
  donationInfo: {
    title: 'Support Our Work',
    instructions: 'Your donation enables GYC to continue empowering young Sierra Leoneans to lead on climate, sustainable development, and gender equality.',
    bank_details: 'Bank transfer details to be added by admin.',
    mobile_money_details: 'Orange Money / Africell Money details to be added by admin.'
  },
  contactSettings: {
    contact_intro: 'We?d love to hear from you. Whether you have questions, want to partner, or just want to connect, reach out to us.',
    contact_address: 'Global Youth Counterpart for Sustainable Development Sierra Leone (GYC)\n41 MacDonald Street\nFreetown, Sierra Leone',
    contact_phone: '+232 78 277 377\n+232 77 945 694',
    contact_email: 'General Inquiries: info@gycsl.org\nPrograms: programmes@gycsl.org\nPartnerships: partnerships@gycsl.org\nMedia: communications@gycsl.org',
    contact_socials: 'Facebook: @GYCSierraLeone\nTwitter/X: @GYC_SierraLeone\nInstagram: @gyc_sierraleone\nLinkedIn: GYC Sierra Leone\nYouTube: GYC Sierra Leone',
    contact_hours: 'Monday - Friday: 9:00 AM - 5:00 PM\nSaturday - Sunday: Closed',
    contact_map_embed: '[Embedded Google Map showing office location]'
  }
};


