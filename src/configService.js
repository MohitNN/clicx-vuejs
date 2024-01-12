const tier_1_countries = [
    'Australia',
    'Austria',
    'Belgium',
    'Canada',
    'Denmark',
    'Finland',
    'France',
    'Germany',
    'Ireland',
    'Italy',
    'Taiwan',
    'Luxembourg',
    'Netherlands',
    'New Zealand',
    'Norway',
    'Spain',
    'Sweden',
    'Switzerland',
    'United Kingdom',
    'United States'
];

const tier_2_countries = [
    'Andorra',
    'Argentina',
    'Bahamas',
    'Belarus',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Chile',
    'China',
    'Colombia',
    'Costa Rica',
    'Croatia',
    'Cyprus',
    'Czech Republic',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'Estonia',
    'Fiji',
    'Greece',
    'Guyana',
    'Hong Kong',
    'Hungary',
    'Iceland',
    'Indonesia',
    'Israel',
    'Japan',
    'Kazakhstan',
    'Latvia',
    'Lithuania',
    'Macao',
    'Malaysia',
    'Malta',
    'Mexico',
    'Montenegro',
    'Morocco',
    'Nepal',
    'Oman',
    'Panama',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Puerto Rico',
    'Qatar',
    'Republic of Korea (South)',
    'Romania',
    'Russian Federation',
    'Saudi Arabia',
    'Serbia',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'South Africa',
    'Thailand',
    'Turkey',
    'Ukraine',
    'United Arab Emirates',
    'Uruguay',
    'Vanuatu'
];
const tier_3_countries = [
    'Albania',
    'Algeria',
    'Angola',
    'Armenia',
    'Azerbaijan',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belize',
    'Benin',
    'Botswana',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Cape Verde',
    'Chad',
    'Comoros',
    'Congo',
    'El Salvador',
    'Ethiopia',
    'Gabon',
    'Georgia',
    'Guatemala',
    'Guinea',
    'Haiti',
    'Honduras',
    'India',
    'Iraq',
    'Jamaica',
    'Jordan',
    'Kenya',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Lebanon',
    'Lesotho',
    'Macedonia',
    'Madagascar',
    'Mali',
    'Mauritania',
    'Mauritius',
    'Moldova',
    'Mongolia',
    'Mozambique',
    'Namibia',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Pakistan',
    'Senegal',
    'Sri Lanka',
    'Suriname',
    'Swaziland',
    'Tajikistan',
    'Tanzania',
    'Togo',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkmenistan',
    'Uganda',
    'Uzbekistan',
    'Vietnam',
    'Zambia'
];
const tier_4_countries = [
    'Afghanistan',
    'Côte d’Ivoire',
    'Cuba',
    'Democratic Republic of the Congo',
    'Equatorial Guinea',
    'Eritrea',
    'Iran',
    'Liberia',
    'Libya',
    'Myanmar',
    'North Korea',
    'Rwanda',
    'Sierra Leone',
    'Somalia',
    'Sudan',
    'Syria',
    'Timor-Leste',
    'Venezuela',
    'Yemen',
    'Zimbabwe'
];

const colors = {
    blue: '#2477FF',
    green: '#2D8515',
    orange: '#E49400',
    red: '#DB2A34',
    purple: '#474D84',
    dark: '#040620',
    teal: '#4179CF',
    pink: '#e671b8',
    gray: '#d6dee5',
    default: '#595d78',
    textColor: '#b4b5bf',
    gridLineColor: '#040620'
};

const link_status = [
    {
        id : 1,
        status : 'Pending',
        name : 'Pending',
        color : 'info',
    },
    {
        id : 2,
        status : 'Active',
        name : 'Active',
        color : 'primary',
    },
    {
        id : 3,
        status : 'Completed',
        name : 'Completed',
        color : 'success',
    },
    {
        id : 4,
        status : 'Evergreen',
        name : 'Evergreen',
        color : 'warning',
    },
    {
        id : 5,
        status : 'My Links',
        name : 'My Links',
        color : 'danger',
    },
]

export default {
    tier_1_countries,
    tier_2_countries,
    tier_3_countries,
    tier_4_countries,
    colors: {
        ...colors,
        white: '#fff'
    },
    link_status : link_status
};
