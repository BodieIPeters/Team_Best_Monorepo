export interface Church {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  denomination: string;
  serviceTimes: string;
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
  },
];