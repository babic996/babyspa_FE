import { useFilter } from "../../context/Filter/useFilter";
import AddButton from "../ButtonComponents/AddButton";
import FilterButton from "../ButtonComponents/FilterButton";

const HeaderButtonsComponent = ({
  onButtonAction,
  buttonTitle,
}: {
  onButtonAction: () => void;
  buttonTitle: string;
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
      <AddButton
        buttonTitle={buttonTitle}
        onButtonAction={onButtonAction}
        buttonStyle={{ marginBottom: 16 }}
      />
      <FilterButton
        buttonTitle="Reset filtera"
        onButtonAction={onResetFilter}
        buttonStyle={{ marginBottom: 16 }}
      />
    </div>
  );
};

export default HeaderButtonsComponent;
