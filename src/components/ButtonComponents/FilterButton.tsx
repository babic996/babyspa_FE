import { Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import React from "react";

const FilterButton = ({
  onButtonAction,
  buttonTitle,
  buttonStyle,
}: {
  onButtonAction: () => void;
  buttonTitle: string;
  buttonStyle?: React.CSSProperties;
}) => {
  return (
    <Button
      type="primary"
      onClick={onButtonAction}
      style={buttonStyle}
      icon={<FilterOutlined />}
    >
      {buttonTitle}
    </Button>
  );
};

export default FilterButton;
