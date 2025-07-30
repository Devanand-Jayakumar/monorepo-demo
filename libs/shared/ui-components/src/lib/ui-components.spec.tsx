import { render } from '@testing-library/react';

import OrgInformaUiComponents from './ui-components';

describe('OrgInformaUiComponents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgInformaUiComponents />);
    expect(baseElement).toBeTruthy();
  });
});
