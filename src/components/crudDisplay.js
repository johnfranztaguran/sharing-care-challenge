import React, { useState, Fragment } from 'react';
import { Card, Icon, Modal, Button, Form, Input, DatePicker, Upload, message } from 'antd';
import { PropTypes } from 'prop-types';
import _get from 'lodash.get';
import { props } from '../imageProps';
import moment from 'moment';

const { Meta } = Card;
const { TextArea } = Input;

const CrudDisplay = ({ items, form }) => {

  const [{ username, description}, setInputs] = useState({
    username: '', description: ''
  });
  const [dateNow, setDateNow] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(undefined);
  const [visible, setVisible] = useState(false)

  const deleteLocalStorageItem = () => {
    const fromLocal = JSON.parse(localStorage.getItem('allCareItem'))
      .filter((v, i) => v.id !== _get(items, 'id', ''));
    return localStorage.setItem("allCareItem", JSON.stringify(fromLocal));
  }

  const updateLocalStorage = () => {
    const fromLocal = JSON.parse(localStorage.getItem('allCareItem'))
    for (let i = 0; i < fromLocal.length; i++) {
      if (_get(items, 'id') === fromLocal[i].id) {
        fromLocal[i].Name = username;
        fromLocal[i].Description = description;
        fromLocal[i].ImageLink = imageUrl;
        fromLocal[i].Date = dateNow;
        break;
      }
    }
    localStorage.setItem("allCareItem", JSON.stringify(fromLocal));
  }

  const onChangeInputs = ({ target: { name, value } }) => {
    setInputs({ [name]: value });
  };

  const editForm = () => {
    const { getFieldDecorator } = form;
    return (
      <Form  className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
            initialValue: _get(items, 'Name', '')
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
              name='username'
              onChange={onChangeInputs}
            />,
          )}
        </Form.Item>
        <Form.Item>
          <TextArea
            placeholder="Description"
            rows={4}
            defaultValue={_get(items, 'Description')}
            name='description'
            onChange={onChangeInputs}
          />
        </Form.Item>
        <Form.Item>
          <DatePicker
            showTime
            placeholder="Select Time"
            onChange={onChangeDate}
            defaultValue={moment(`${_get(items, 'Date')}`, 'YYYY-MM-DD HH:mm:ss')}
          />
        </Form.Item>
        <Form.Item>
          <Upload
            {...props}
            onChange={onChangeUpload}
            showUploadList={true}
          >
            <Button>
              <Icon type="upload" /> Click to Upload
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    )
  }

  const onChangeUpload = info => {
    if (info.file.status !== 'uploading') {
      console.log('image upload ****', info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setImageUrl(info.file.response.url)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const onChangeDate = (value, dateString) => {
    setDateNow(dateString)
  }

  const formatForShowView = () => {
    const keyValueItems = {};
    keyValueItems.Name = _get(items, 'Name', '');
    keyValueItems.Description = _get(items, 'Description');
    keyValueItems.Date = _get(items, 'Date');
    keyValueItems['Image Url'] = _get(items, 'ImageLink');
    return keyValueItems;
  };

  const showModal = () => {
    setVisible(true)
  };

  const handleOk = e => {
    setVisible(false)
    updateLocalStorage();
  };

  const handleCancel = e => {
    setVisible(false)
  };

  return (
    <div>
      {
        items === undefined || items === null || !items ? (
          <p>Please Select Item First ...</p>
        ) : (
          <Fragment>
            <Modal
              title="Add Person"
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              {editForm()}
            </Modal>
            <div >
              <Card
                className='isoDisplay-crud'
                hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src={_get(items, 'ImageLink')} />}
              >
                <Meta title={_get(items, 'Name', '')} description={_get(items, 'Date')} />
                <span>Description: {_get(items, 'Description')}</span>
              </Card>
            </div>
            <Button onClick={() => showModal()}>
              <Icon type='edit' />
            </Button>
            <Button onClick={() => deleteLocalStorageItem()}>
              <Icon type='delete' />
            </Button>
          </Fragment>
        )
      }
    </div>
  )
}

CrudDisplay.propTypes = {
  form: PropTypes.object,
  items: PropTypes.object,
};

export default Form.create()(CrudDisplay);