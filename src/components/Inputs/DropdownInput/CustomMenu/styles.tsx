import styled from "styled-components";

export const List = styled.ul.attrs((_) => ({
  className: "list-unstyled",
}))`
  margin-bottom: 0;
  padding-left: 0;
  max-height: 300px;
  overflow-y: auto;
  user-select: none;
  list-style: none;
  & .dropdown-item {
    max-width: 60vw;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
