import React, { PureComponent } from 'react';
import { Input } from 'antd';

class CrudSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <Input
          placeholder="Search"
        />
      </React.Fragment>
    );
  }
}

export default CrudSearch;