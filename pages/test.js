import { signOut } from 'next-auth/react';
import { Button } from '@mui/material';

export default function TestPage() {
  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => signOut({ callbackUrl: '/manager/login' })}
      >
        Log Out
      </Button>
    </div>
  );
}
