import LoginPage from './LoginPage';
import NxWelcome from './nx-welcome';

import { OrgInformaUiComponents } from '@org-informa/ui-components';
import {utilPingIdentity} from '@org-informa/shared-util-ping-identity';

export function App() {

  const pingValue_demo=utilPingIdentity();

  return (
    <div>
      <NxWelcome title="@org-informa/eventExp" />
      <LoginPage />
      <p>New line of code added for demo</p>
      <p>Code for release without scope</p>
      <OrgInformaUiComponents />
      <p>{pingValue_demo}</p>
    </div>
  );
}
export default App;
