import React from 'react';

const Checkbox = (props) => <div data-testid="Checkbox">{props.value ? 'checked' : 'unchecked'}</div>;

export default Checkbox;
