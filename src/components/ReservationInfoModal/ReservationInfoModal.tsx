import { Modal } from "antd";
import React from "react";
import { ReservationShortDetailsInterface } from "../../interfaces/ReservationShortDetailsInterface";
import dayjs from "dayjs";

interface ReservationInfoModalProps {
  visible: boolean;
  onClose: () => void;
  reservations: ReservationShortDetailsInterface[];
}

const ReservationInfoModal: React.FC<ReservationInfoModalProps> = ({
  visible,
  onClose,
  reservations,
}) => {
  return (
    <Modal
      title={<div style={{ textAlign: "center" }}>Rezervacije</div>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={460}
    >
      <div>
        {reservations.length > 0 ? (
          reservations.map((reservation, index) => {
            const startDateFormatted = dayjs(reservation.startDate).format(
              "HH:mm"
            );
            const endDateFormatted = dayjs(reservation.endDate).format("HH:mm");
            const dateOnlyFormatted = dayjs(reservation.startDate).format(
              "DD.MM.YYYY."
            );

            return (
              <div key={index}>
                {dateOnlyFormatted} {"od"} {startDateFormatted} do{" "}
                {endDateFormatted} {" časova - ("}
                {reservation.statusName}
                {")"}
              </div>
            );
          })
        ) : (
          <p style={{ textAlign: "center" }}>
            Nema rezervacija za ovaj aranžman
          </p>
        )}
      </div>
    </Modal>
  );
};

export default ReservationInfoModal;
