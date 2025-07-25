import LoginPage from './LoginPage';
import NxWelcome from './nx-welcome';

import { OrgInformaUiComponents } from '@org-informa/ui-components';
import {} from '@org-informa/shared-util-ping-identity';

export function App() {
  return (
    <div>
      <NxWelcome title="@org-informa/eventExp" />
      <LoginPage />
      <p>New line of code added for demo</p>
      <p>Code for release without scope</p>
      <OrgInformaUiComponents />
    </div>
  );
}

export default App;
