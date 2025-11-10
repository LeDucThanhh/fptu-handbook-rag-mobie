import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useAuthContext();

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { isAuthenticated, token, user, roles } = context;
  const isStudent = roles?.includes?.('Student');
  const isMentor = roles?.includes?.('Mentor');
  const isStaff = roles?.some?.((role) => ['Student Affairs', 'Academic Office', 'System Administrator'].includes(role));

  return {
    ...context,
    isAuthenticated,
    token,
    user,
    roles,
    isStudent,
    isMentor,
    isStaff
  };
};

export default useAuth;

