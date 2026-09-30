export interface Church {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  denomination: string;
  serviceTimes: string;
  worshipStyle: 'Contemporary' | 'Traditional' | 'Liturgical' | 'Blended';
  distanceMiles: number;
  rating: number;
  description: string;
  userFeedback: string[];
}

export const MOCK_CHURCHES: Church[] = [
  {
    id: '1',
    name: 'Cathedral of St. Andrew',
    address: '301 Sheldon Blvd SE',
    city: 'Grand Rapids',
    state: 'MI',
    zipcode: '49503',
    denomination: 'Catholic',
    serviceTimes: 'Sun 8:30 AM, 10:30 AM, 5:30 PM',
    worshipStyle: 'Liturgical',
    distanceMiles: 1.8,
    rating: 4.8,
    description: 'Beautiful historic cathedral offering reverent traditional Catholic Mass near downtown.',
    userFeedback: ['Welcoming community with active young adult and college groups.'],
  },
  {
    id: '2',
    name: 'Crossroads Bible Church',
    address: '800 Scribner Ave NW',
    city: 'Grand Rapids',
    state: 'MI',
    zipcode: '49504',
    denomination: 'Nondenominational',
    serviceTimes: 'Sun 9:00 AM & 10:45 AM',
    worshipStyle: 'Contemporary',
    distanceMiles: 2.3,
    rating: 4.7,
    description: 'Engaging modern worship and biblically focused teaching close to campus.',
    userFeedback: ['Great worship team and easy to find rides from campus.'],
  },
  {
    id: '3',
    name: 'Calvary Church',
    address: '707 East Beltline Ave NE',
    city: 'Grand Rapids',
    state: 'MI',
    zipcode: '49525',
    denomination: 'Nondenominational',
    serviceTimes: 'Sun 9:00 AM & 10:45 AM',
    worshipStyle: 'Blended',
    distanceMiles: 5.1,
    rating: 4.6,
    description: 'Large community with extensive student ministry programs and outreach groups.',
    userFeedback: [],
  },
  {
    id: '4',
    name: 'Madison Square Church',
    address: '1441 Madison Ave SE',
    city: 'Grand Rapids',
    state: 'MI',
    zipcode: '49507',
    denomination: 'Christian Reformed',
    serviceTimes: 'Sun 10:00 AM',
    worshipStyle: 'Contemporary',
    distanceMiles: 3.0,
    rating: 4.9,
    description: 'A diverse urban congregation passionate about justice, community, and gospel grace.',
    userFeedback: ['Incredible community and super welcoming to college students.'],
  },
  {
    id: '5',
    name: 'Mayflower Congregational Church',
    address: '2345 Robinson Rd SE',
    city: 'Grand Rapids',
    state: 'MI',
    zipcode: '49506',
    denomination: 'Congregational',
    serviceTimes: 'Sun 10:00 AM',
    worshipStyle: 'Traditional',
    distanceMiles: 3.8,
    rating: 4.4,
    description: 'Thoughtful sermons, classical organ and choir music, and warm hospitality.',
    userFeedback: [],
  },
  {
    id: '6',
    name: 'Ada Bible Church (East Paris)',
    address: '1640 E Paris Ave SE',
    city: 'Grand Rapids',
    state: 'MI',
    zipcode: '49546',
    denomination: 'Nondenominational',
    serviceTimes: 'Sun 9:00 AM & 11:00 AM',
    worshipStyle: 'Contemporary',
    distanceMiles: 6.2,
    rating: 4.7,
    description: 'High-energy contemporary worship with practical, clear teaching.',
    userFeedback: ['Great small groups for college students!'],
  },
];