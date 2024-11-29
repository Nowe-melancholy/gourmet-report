import { Link } from '@remix-run/react';
import { Button } from '~/components/ui/button';

export const loader = async () => {
  return {};
};

export default function AdminTop() {
  return (
    <Link to='/admin/add-report'>
      <Button>Add</Button>
    </Link>
  );
}
