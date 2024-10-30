import { Button } from "antd";
import { useFilter } from "../../context/Filter/useFilter";
import { PlusOutlined, FilterOutlined } from "@ant-design/icons";

const HeaderButtonsComponent = ({
  onButtonAction,
  buttonTitle,
}: {
  onButtonAction?: () => void;
  buttonTitle?: string | null;
}) => {
  const { onResetFilter } = useFilter();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 16,
        justifyContent: "space-between",
      }}
    >
      <Button
        type="primary"
        onClick={onButtonAction}
        style={{ marginBottom: 16 }}
        icon={<PlusOutlined />}
      >
        {buttonTitle}
      </Button>
      <Button
        type="primary"
        onClick={onResetFilter}
        icon={<FilterOutlined />}
        style={{ marginBottom: 16 }}
      >
        Reset filtera
      </Button>
    </div>
  );
};

export default HeaderButtonsComponent;
