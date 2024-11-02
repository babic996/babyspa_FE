import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Popconfirm,
} from "antd";
import "./HomePage.scss";
import CalendarComponent from "../../components/CalendarComponent/CalendarComponent";
import { useEffect, useRef, useState } from "react";
import {
  CreateOrUpdateReservationInterface,
  OverviewReservationInterface,
} from "../../interfaces/ReservationInterface";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { getStatusList } from "../../services/StatusService";
import {
  addReservation,
  deleteReservation,
  editReservation,
  getReservationsList,
} from "../../services/ReservationServices";
import { StatusInterface } from "../../interfaces/StatusInterface";
import { ShortDetailsInterface } from "../../interfaces/ShortDetails";
import { getArrangementsList } from "../../services/ArrangementService";
import {
  toastErrorNotification,
  toastSuccessNotification,
} from "../../util/toastNotification";
import dayjs from "dayjs";
import FullPageSpiner from "../../components/FullPageSpiner/FullPageSpiner";
import { yupResolver } from "@hookform/resolvers/yup";
import { getReservationSchema } from "../../validations/ReservationValidationSchema";
import { errorResponse } from "../../util/const";
import AddButton from "../../components/ButtonComponents/AddButton";

const HomePage = () => {
  const isModalOpen = useRef<boolean>(false);
  const [isEditReservation, setIsEditReservation] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusInterface[]>([]);
  const [reservations, setReservations] = useState<
    OverviewReservationInterface[]
  >([]);
  const [arrangements, setArrangements] = useState<ShortDetailsInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const reservationSchema = getReservationSchema(isEditReservation);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CreateOrUpdateReservationInterface>({
    resolver: yupResolver(reservationSchema),
  });

  //------------------LIFECYCLE----------------

  useEffect(() => {
    Promise.all([
      getArrangementsList(),
      getStatusList("reservation"),
      getReservationsList(),
    ])
      .then(([arrangementsRes, statusRes, reservationsRes]) => {
        setArrangements(arrangementsRes);
        setStatus(statusRes);
        setReservations(reservationsRes);
        setLoading(false);
      })
      .catch((e) => {
        errorResponse(e);
      });
  }, []);

  //------------------METHODS----------------

  const handleEdit = (record: CreateOrUpdateReservationInterface) => {
    setIsEditReservation(true);
    reset({
      reservationId: record.reservationId,
      note: record?.note,
      statusId: record.statusId,
    });
    isModalOpen.current = true;
  };

  const handleDelete =
    (reservationId?: number | null) =>
    (e: React.MouseEvent<HTMLElement> | undefined) => {
      e?.preventDefault();
      if (reservationId) {
        setLoading(true);
        deleteReservation(reservationId).then(() => {
          getReservationsList()
            .then((result) => {
              setLoading(false);
              setReservations(result);
              getArrangementsList().then((res) => setArrangements(res));
              toastSuccessNotification("Obrisano!");
            })
            .catch((e) => {
              setLoading(false);
              toastErrorNotification(e.response.data.message);
            });
        });
      }
      isModalOpen.current = false;
    };

  const handleModalCancel = () => {
    reset({
      reservationId: null,
      startDate: null,
      statusId: null,
      durationReservation: null,
      arrangementId: null,
      note: "",
    });
    setIsEditReservation(false);
    isModalOpen.current = false;
  };

  const handleCreateModal = () => {
    reset({
      reservationId: null,
      statusId: null,
      startDate: null,
      durationReservation: null,
      arrangementId: null,
      note: "",
    });
    setIsEditReservation(false);
    isModalOpen.current = true;
  };

  const onSubmit: SubmitHandler<CreateOrUpdateReservationInterface> = async (
    data
  ) => {
    setLoading(true);
    if (isEditReservation) {
      try {
        const res = await editReservation(data);
        setReservations((prev) =>
          prev.map((item) =>
            item.reservationId === data.reservationId
              ? { ...item, ...res.data.data }
              : item
          )
        );
        isModalOpen.current = false;
        const arrangements = await getArrangementsList();
        setArrangements(arrangements);
        toastSuccessNotification("Ažurirano!");
      } catch (e) {
        errorResponse(e);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await addReservation(data);
        const result = await getReservationsList();
        setReservations(result);

        const arrangements = await getArrangementsList();
        setArrangements(arrangements);

        isModalOpen.current = false;
        toastSuccessNotification("Sačuvano!");
      } catch (e) {
        errorResponse(e);
      } finally {
        setLoading(false);
      }
    }
  };

  //------------------RENDER------------------

  const layout = {
    labelCol: { span: isEditReservation ? 4 : 6 },
    wrapperCol: { span: isEditReservation ? 20 : 18 },
  };

  return (
    <>
      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            {isEditReservation ? "Uredi rezervaciju" : "Dodaj novi rezervaciju"}
          </div>
        }
        maskClosable={false}
        open={isModalOpen.current}
        footer={null}
        width={800}
        onCancel={handleModalCancel}
      >
        <Form onFinish={handleSubmit(onSubmit)} {...layout}>
          {!isEditReservation && (
            <Form.Item
              label="Odaberi aranžman"
              validateStatus={errors.arrangementId ? "error" : ""}
              help={errors.arrangementId?.message}
            >
              <Controller
                name="arrangementId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Odaberi aranžman"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children as string)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {arrangements?.map((x) => (
                      <Select.Option key={x.id} value={x.id}>
                        {x.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>
          )}
          {!isEditReservation && (
            <Form.Item
              label="Datum i vrijeme termina"
              validateStatus={errors.startDate ? "error" : ""}
              help={errors.startDate?.message}
            >
              <Controller
                name="startDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    showTime
                    value={value ? dayjs(value, "YYYY-MM-DD HH:mm:ss") : null}
                    onChange={(date) =>
                      onChange(
                        date ? dayjs(date).format("YYYY-MM-DDTHH:mm:ss") : ""
                      )
                    }
                    style={{ width: "100%" }}
                  />
                )}
              />
            </Form.Item>
          )}
          {!isEditReservation && (
            <Form.Item
              label="Trajanje termina u minutama"
              validateStatus={errors.durationReservation ? "error" : ""}
              help={errors.durationReservation?.message}
            >
              <Controller
                name="durationReservation"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} min={0} style={{ width: "100%" }} />
                )}
              />
            </Form.Item>
          )}

          {isEditReservation && (
            <Form.Item
              label="Odaberi status"
              validateStatus={errors.statusId ? "error" : ""}
              help={errors.statusId?.message}
            >
              <Controller
                name="statusId"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Odaberi status">
                    {status?.map((x) => (
                      <Select.Option
                        key={x.statusId}
                        value={x.statusId}
                        style={
                          status?.find((x) => x.statusCode === "term_canceled")
                            ?.statusId == x.statusId
                            ? { color: "red" }
                            : {}
                        }
                      >
                        {x.statusName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>
          )}
          <Form.Item
            label="Bilješka"
            validateStatus={errors.note ? "error" : ""}
            help={errors.note?.message}
          >
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  value={field.value ?? ""}
                  autoSize={{ minRows: 0, maxRows: 6 }}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      e.preventDefault();
                      const newValue = `${field.value ?? ""}\n`;
                      field.onChange(newValue);
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }} wrapperCol={{ span: 24 }}>
            <Button.Group>
              <Button type="primary" htmlType="submit">
                Sačuvaj
              </Button>
              {isEditReservation && (
                <>
                  <Popconfirm
                    title="Brisanje rezervacije"
                    description="Da li želite da izbrišete rezervaciju?"
                    okText="Da"
                    cancelText="Ne"
                    onConfirm={handleDelete(getValues("reservationId"))}
                  >
                    <Button type="default" danger>
                      Obriši
                    </Button>
                  </Popconfirm>
                </>
              )}
            </Button.Group>
          </Form.Item>
        </Form>
      </Modal>
      {loading && <FullPageSpiner />}
      <div className="container">
        <div className="button-legend-container">
          <AddButton
            buttonTitle=" Dodaj rezervaciju"
            onButtonAction={handleCreateModal}
            buttonStyle={{ marginBottom: 16 }}
          />

          <div className="legend">
            <div className="legend-item">
              <div
                className="color-box"
                style={{ backgroundColor: "#16c9d3" }}
              />
              <span>Rezervisan termin</span>
            </div>
            <div className="legend-item">
              <div
                className="color-box"
                style={{ backgroundColor: "#f40511" }}
              />
              <span>Otkazan termin</span>
            </div>
            <div className="legend-item">
              <div
                className="color-box"
                style={{ backgroundColor: "#4caf50" }}
              />
              <span>Iskorišten termin</span>
            </div>
            <div className="legend-item">
              <div
                className="color-box"
                style={{ backgroundColor: "#ff660d" }}
              />
              <span>Termin nije iskorišten</span>
            </div>
          </div>
        </div>
        <div className="calendar-wrapper">
          <CalendarComponent
            reservations={reservations}
            onEventClick={handleEdit}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
