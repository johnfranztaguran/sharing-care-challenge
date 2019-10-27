import React from 'react';
import { PropTypes } from 'prop-types';
import { List } from 'antd';
import Scrollbar from 'react-smooth-scrollbar';
import { Link, BrowserRouter } from 'react-router-dom';
import _get from 'lodash.get';
import moment from 'moment';

const scrollElement = React.createRef();

const CrudList = ({ items, toRender }) => {
  const sortedByDate = items.sort((a,b) => moment(b.Date).format('YYYYMMDD HH:mm:ss') - moment(a.Date).format('YYYY-MM-DD HH:mm:ss'));
  
  return (
    <div className="isoCrudList">
      <Scrollbar
        ref={scrollElement}
        className="itemListScrollbar"
      >
        <BrowserRouter>
          <List
            itemLayout="horizontal"
            dataSource={sortedByDate}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={
                  <Link
                    to={{ pathname: `/noRoute/${item.id}`}}
                    onClick={() => toRender(item)}
                    >{item.Name}</Link>
                  }
                />
              </List.Item>
            )}
          />
        </BrowserRouter>
      </Scrollbar>
    </div>
  );
}

CrudList.propTypes = {
  toRender: PropTypes.func,
  items: PropTypes.array,
};

export default CrudList;
