import styled from 'styled-components'; // eslint-disable-line import/no-unresolved
import { palette } from 'styled-theme';

const CrudWrapper = styled.div`
  padding: 50px 35px;
  display: flex;
  @media only screen and (max-width: 767px) {
    padding: 50px 20px;
    flex-direction: column;
    height: auto;
  }

  @media only screen and (min-width: 768px) and (max-width: 990px) {
    padding: 40px 30px;
  }

  .isoCrudList {
    @media (max-width: 767px) {
      display: none;
    }
  }

  .isoDisplay-crud {
    left: 300px;
  }

  .isoCrudListBar {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    flex-grow: 1;

    @media only screen and (max-width: 767px) {
      width: auto !important;
      min-width: 0 !important;
      max-width: 100% !important;
      flex: 0 !important;
    }
    @media only screen and (min-width: 768px) and (max-width: 990px) {
      width: 270px !important;
      flex: 0 0 270px !important;
    }

    @media only screen and (min-width: 768px) {
      position: relative;
      background: #ffffff;
      border: 1px solid ${palette('border', 0)};
      width: 320px;
      overflow: hidden;
    }
  }

  .isoCrudBoxWrapper {
    width: 100%;
    display: flex;
    overflow-x: hidden;
    justify-content: flex-start;
    background-color: #ffffff;
    border: 1px solid ${palette('border', 0)};
    position: relative;

    .isoCrudBox {
      width: 100%;
      height: 100%;
    }

    .crudBoxScrollbar {
      height: calc(100vh - 225px);
    }
  }
`;

export default CrudWrapper;
