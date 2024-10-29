import { Modal } from "antd";
import React from "react";

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  fullText: string;
}

const InfoModal: React.FC<InfoModalProps> = ({
  visible,
  onClose,
  fullText,
}) => {
  const formattedText = fullText.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
  return (
    <Modal
      title={<div style={{ textAlign: "center" }}>Bilješka</div>}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <p>{formattedText}</p>
    </Modal>
  );
};

export default InfoModal;
