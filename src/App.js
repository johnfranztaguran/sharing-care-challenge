import React, { Fragment, PureComponent } from 'react';
import { Form, Icon, Input, Button, Modal, Layout, DatePicker, Upload, message } from 'antd';
import './App.css';
import { props } from '../src/imageProps';
import uuid from 'uuid/v1';
import Scrollbar from 'react-smooth-scrollbar';
import CrudWrapper from './styledComponents/crud.style';
import CrudListWrapper from './styledComponents/crudlist.style';
import CrudSearch from './components/crudSearch';
import CrudList from './components/crudList';
import CrudDisplay from './components/crudDisplay';

const { Content } = Layout;
const { TextArea } = Input;

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      description: '',
      imageUrl: undefined,
      dateSet: undefined,
      addedItem: [],
      searching: true,
      visible: false,
      toDisplay: undefined
    }
    this.scrollElement = React.createRef();
  }

  componentDidMount() {
    this.getExistingData();
  }

  componentDidUpdate = (prevState, nextState) => {
    if (JSON.parse(localStorage.getItem('allCareItem')).length !== nextState.addedItem.length) {
      this.getExistingData();
    }
    if (JSON.stringify(JSON.parse(localStorage.getItem('allCareItem'))) !== JSON.stringify(nextState.addedItem)) {
      this.getExistingData();
    }
  }

  // shouldComponentUpdate = (prevState, nextState) => {
  //   if (JSON.parse(localStorage.getItem('allCareItem')).length !== nextState.addedItem.length) {
  //     return true
  //   }
  //   if (JSON.stringify(JSON.parse(localStorage.getItem('allCareItem'))) !== JSON.stringify(nextState.addedItem)) {
  //     return true
  //   }
  //   return false
  // }

  getExistingData = async () => {
    try {
      const result = await JSON.parse(localStorage.getItem('allCareItem'));
      if (result !== null) {
        this.setState({ addedItem: result })
      }
      
    } catch (err) {
      console.log(err)
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        this.addEntry();
      }
    });
  };

  onChangeDate = (value, dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    this.setState({ dateSet: dateString})
  }

  addEntry = () => {
    const { username, description, imageUrl, dateSet} = this.state;
    let existingEntries = JSON.parse(localStorage.getItem('allCareItem'));
    if(existingEntries === null) existingEntries = [];
    let addInputEntry = {
        Name: username,
        Description: description,
        ImageLink: imageUrl,
        Date: dateSet,
        id: uuid()
    };
    localStorage.setItem("entryCare", JSON.stringify(addInputEntry));
    existingEntries.push(addInputEntry);
    localStorage.setItem("allCareItem", JSON.stringify(existingEntries));
    const getItem = localStorage.getItem('allCareItem')
    this.setState({
      addedItem: JSON.parse(getItem),
      username: '',
      description: '',
      imageUrl: undefined,
      dateSet: undefined,
    });
  };

  onChangeUpload = info => {
    if (info.file.status !== 'uploading') {
      console.log('image upload ****', info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      this.setState({ imageUrl: info.file.response.url })
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  onChangeInputs = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  addForm = () => {
    const { username, description, addedItem } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
            initialValue: username
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
              name='username'
              onChange={this.onChangeInputs}
            />,
          )}
        </Form.Item>
        <Form.Item>
          <TextArea
            placeholder="Description"
            rows={4}
            value={description}
            name='description'
            onChange={this.onChangeInputs}
          />
        </Form.Item>
        <Form.Item>
          <DatePicker showTime placeholder="Select Time" onChange={this.onChangeDate} />
        </Form.Item>
        <Form.Item>
          <Upload {...props} onChange={this.onChangeUpload} multiple={false}>
            <Button>
              <Icon type="upload" /> Click to Upload
            </Button>
          </Upload>
          {
            !addedItem.length ? (
              <Button type="primary" htmlType="submit" className="login-form-button">
                ADD
              </Button>
            ) : ''
          }
        </Form.Item>
      </Form>
    )
  }

  showModal = () => {
    this.setState({
      visible: true,
      username: '',
      description: '',
      imageUrl: undefined,
      dateSet: undefined,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
    this.addEntry();
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  fromListToRender = item => {
    this.setState({ toDisplay: item })

  }

  render() {
    const { addedItem, searching, visible, username, toDisplay } = this.state;
    console.log('this is dummy item ===', addedItem);
    return (
      <div className="App">
        <Modal
          title="Add Person"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okButtonProps={{ disabled: !username }}
          // cancelButtonProps={{ disabled: true }}
        >
          {this.addForm()}
        </Modal>
        <CrudWrapper className={`isomorphicItems${searching ? ' searching' : ''}`}>
          <div className="isoCrudListBar">
            <CrudListWrapper>
              <CrudSearch />
              <CrudList
                items={addedItem}
                toRender={this.fromListToRender}
                getExistingData={this.getExistingData}
              />
            </CrudListWrapper>
          </div>
          <Layout className="isoCrudBoxWrapper">
            <Content className="isoCrudBox">
              <Scrollbar ref={this.scrollElement} className="crudBoxScrollbar" continuousScrolling>
                {
                  addedItem.length ? (
                    <Fragment>
                      <Button onClick={this.showModal}>
                        <Icon type='plus' />
                      </Button>
                      <CrudDisplay items={toDisplay}/>
                    </Fragment>
                  ) : (
                    this.addForm()
                  )
                }
              </Scrollbar>
            </Content>
          </Layout>
        </CrudWrapper>
      </div>
    )
  }
}

export default Form.create()(App);
