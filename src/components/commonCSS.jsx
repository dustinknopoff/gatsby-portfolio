import styled, { css } from "styled-components";

export const Card = styled.div`
  background: rgba(242, 242, 242, 0.89);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 9px;

  &hover {
    background: rgba(242, 242, 242, 1);
    cursor: pointer;
  }

  @media (prefers-color-scheme: dark) {
    background-color: rgba(54, 56, 58, 0.89) !important;
    color: #efefef !important;

    &hover {
      background: rgba(54, 56, 58, 1);
    }
  }

  ${props =>
    props.about &&
    css`
      margin-top: 10px;
      text-align: center;
      font-weight: 500;
      font-size: 22px;
      width: 30vw;
      padding: 10px;

      @media only screen and (max-width: 650px) {
        width: 90vw;
        background: rgba(255, 255, 255, 0.9);
      }
    `};

  ${props =>
    props.recent &&
    css`
      text-align: center;
      font-weight: 500;
      font-size: 22px;
      width: 30vw;
      padding: 10px;
      margin-top: 10vh;

      @media only screen and (max-width: 650px) {
        width: 90vw;
        background: rgba(255, 255, 255, 0.9);
      }
    `};

  ${props =>
    props.page &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 40px;
      width: 50vw;

      @media only screen and (max-width: 425px) {
        width: 70vw;
        margin: 10px;
        flex-direction: column;
      }
    `};
`;

export default { Card };
