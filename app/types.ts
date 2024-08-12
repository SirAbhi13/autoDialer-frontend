// User type (based on Django's built-in User model)
export type Usertype = {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  
  // Contact type
export type Contacttype = {
    id: number;
    user: Usertype;
    first_name: string;
    last_name: string;
    city: string;
    phone_number: string;
  };
  
  // ContactList type
export type ContactListtype = {
    id: number;
    user: Usertype;
    name: string;
    contacts: Contacttype[];
  };
  
  // CallRecord type
export type CallRecord = {
    id: number;
    sid: string;
    user: Usertype;
    contact: Contacttype | null;
    createdAt: string; // ISO 8601 date string
    phoneNumber: string;
    duration: number;
    cost: number;
    status: string;
  };