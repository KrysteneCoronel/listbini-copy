interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  userType: 'customer' | 'employee';
  employeeId?: string;
}

const usersDatabase: User[] = [
  // Sample users for demonstration
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    userType: 'customer'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    password: 'employee123',
    userType: 'employee',
    employeeId: 'EMP001'
  }
];

export const login = (credentials: { email?: string; password?: string; employeeId?: string; userType: 'customer' | 'employee' }) => {
  const { email, password, employeeId, userType } = credentials;
  
  if (userType === 'employee' && employeeId) {
    const user = usersDatabase.find(user => 
      user.userType === 'employee' && user.employeeId === employeeId
    );
    return user ? true : false;
  }
  
  if (email && password) {
    const user = usersDatabase.find(user => 
      user.email === email && user.password === password && user.userType === userType
    );
    return user ? true : false;
  }
  
  return false;
};

export const signUp = (userData: { firstName: string; lastName: string; email: string; password: string; userType: 'customer' | 'employee' }) => {
  const { email, userType } = userData;
  
  const userExists = usersDatabase.some(user => user.email === email);
  if (!userExists) {
    const newUser: User = {
      id: (usersDatabase.length + 1).toString(),
      ...userData
    };
    usersDatabase.push(newUser);
    return true;
  }
  return false;
};