import styled from "styled-components";

type Props = {
  $isPaddedRight: boolean;
  $isInvalid: boolean;
  $isDisabled: boolean;
};

export const Toggle = styled.div.attrs<{ $isInvalid: boolean }>(
  ({ $isInvalid }) => ({
    className: "form-select " + ($isInvalid ? "is-invalid" : ""),
  }),
)<Props>`
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;

  user-select: none;
  ${({ $isDisabled }) =>
    $isDisabled &&
    ` 
    background-color: var(--tblr-bg-surface-secondary);
    color: var(--tblr-secondary);
    `};
  transition: border-color 0.15s;
  &:after {
    content: "";
    opacity: 0;
    display: inline-block;
    margin: 0;
    border: none;
  }

  ${({ $isPaddedRight }) =>
    $isPaddedRight &&
    `
      padding-right: 3.5rem !important;
    `}
  > div {
    position: absolute;
    display: flex;
    align-items: center;
  }
`;
