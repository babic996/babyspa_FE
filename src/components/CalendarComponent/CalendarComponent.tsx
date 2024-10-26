import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  CreateOrUpdateReservationInterface,
  OverviewReservationInterface,
} from "../../interfaces/ReservationInterface";
import dayjs from "dayjs";
import "dayjs/locale/bs";
import { convertOverviewReservationInterfaceToCreateOrUpdateReservationInterface } from "../../mappers/ReservationMapper";
import { calendarMessages } from "../../util/const";
import { FaInfoCircle } from "react-icons/fa";
import { useState } from "react";
import { Modal, Typography } from "antd";
const { Paragraph, Title } = Typography;
dayjs.locale("bs");

const localizer = dayjsLocalizer(dayjs);

interface CalendarComponentProps {
  reservations?: OverviewReservationInterface[];
  onEventClick: (record: CreateOrUpdateReservationInterface) => void;
}
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  reservation: OverviewReservationInterface;
  id: number;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  reservations,
  onEventClick,
}) => {
  const [showInfoIcon, setShowInfoIcon] = useState<number | null>(null);
  const [openInfoModal, setIsOpenInfoModal] = useState<boolean>(false);
  const [reservationInfo, setReservationInfo] =
    useState<OverviewReservationInterface | null>();

  const events =
    reservations?.map((reservation) => ({
      title:
        reservation.arrangement.babyDetails.value +
        " - " +
        reservation.status.statusName,
      start: dayjs(reservation.startDate).toDate(),
      end: dayjs(reservation.endDate).toDate(),
      reservation: reservation,
      id: reservation.reservationId,
    })) || [];

  const handleEventClick = (event: CalendarEvent) => {
    onEventClick(
      convertOverviewReservationInterfaceToCreateOrUpdateReservationInterface(
        event.reservation
      )
    );
  };

  const handleOpenInfoModal = () => {
    setIsOpenInfoModal(true);
  };

  const handleCancelInfoModal = () => {
    setIsOpenInfoModal(false);
    setReservationInfo(null);
  };

  const eventRender = ({ event }: { event: CalendarEvent }) => {
    const handleIconClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setReservationInfo(event.reservation);
      handleOpenInfoModal();
    };

    return (
      <div
        style={{ display: "flex", alignItems: "center" }}
        onMouseLeave={() => setShowInfoIcon(null)}
        onMouseEnter={() => setShowInfoIcon(event.id)}
      >
        {showInfoIcon === event.id && (
          <span
            onClick={handleIconClick}
            style={{
              cursor: "pointer",
              marginRight: "4px",
            }}
          >
            <FaInfoCircle />
          </span>
        )}
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {event.title}
        </span>
      </div>
    );
  };

  return (
    <>
      <Modal
        title={<div style={{ textAlign: "center" }}>Informacije</div>}
        maskClosable={false}
        open={openInfoModal}
        onCancel={handleCancelInfoModal}
        width={400}
        footer={null}
      >
        <Typography
          style={{
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <Title level={5} style={{ color: "#333", marginBottom: "10px" }}>
            Podaci o bebi
          </Title>
          <Paragraph
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              marginBottom: "15px",
            }}
          >
            {reservationInfo?.arrangement.babyDetails.value}
          </Paragraph>

          <Title level={5} style={{ color: "#333", marginBottom: "10px" }}>
            Paket usluge
          </Title>
          <Paragraph
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              marginBottom: "15px",
            }}
          >
            {reservationInfo?.arrangement.servicePackage.value}
          </Paragraph>

          <Title level={5} style={{ color: "#333", marginBottom: "10px" }}>
            Status
          </Title>
          <Paragraph
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              marginBottom: "15px",
            }}
          >
            {reservationInfo?.status.statusName}
          </Paragraph>

          <Title level={5} style={{ color: "#333", marginBottom: "10px" }}>
            Broj preostalih termina aranžmana
          </Title>
          <Paragraph
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              marginBottom: "15px",
            }}
          >
            {reservationInfo?.arrangement.remainingTerm}
          </Paragraph>
        </Typography>
      </Modal>
      <div style={{ height: "calc(100vh - 50px)" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day"]}
          defaultView="month"
          onSelectEvent={handleEventClick}
          messages={calendarMessages}
          components={{
            event: eventRender,
          }}
        />
      </div>
    </>
  );
};

export default CalendarComponent;
