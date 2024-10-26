import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Table,
  Button,
  Modal,
  Popconfirm,
  Input,
  Form,
  InputNumber,
  DatePicker,
} from "antd";
import "./BabyPage.scss";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { BabyInterface } from "../../interfaces/BabyInterface";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { getBabyValidationSchema } from "../../validations/BabyValidationSchema";
import {
  getBabies,
  addBaby,
  editBaby,
  deleteBaby,
} from "../../services/BabyService";
import dayjs from "dayjs";
import { DEFAULT_PAGE_SIZE, errorResponse } from "../../util/const";
import InfoModal from "../../components/InfoModal/InfoModal";
import {
  toastErrorNotification,
  toastSuccessNotification,
} from "../../util/toastNotification";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import { useFilter } from "../../context/Filter/useFilter";

const BabyPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number>(1);
  const [babies, setBabies] = useState<BabyInterface[]>([]);
  const [totalElements, setTotalElements] = useState<number>();
  const [isEditBaby, setIsEditBaby] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentNote, setCurrentNote] = useState<string>("");
  const [isInfoModalVisible, setIsInfoModalVisible] = useState<boolean>(false);
  const schema = getBabyValidationSchema(isEditBaby);
  const { filter } = useFilter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BabyInterface>({
    resolver: yupResolver(schema),
  });

  //------------------LIFECYCLE------------------

  useEffect(() => {
    getBabies(cursor - 1, filter)
      .then((result) => {
        setBabies(result.data.content);
        setTotalElements(result.data.totalElements);
        setLoading(false);
      })
      .catch((e) => {
        toastErrorNotification(e.response.data.message);
      });
  }, [cursor, filter]);

  //------------------METOHDS------------------

  const handleEdit = (record: BabyInterface) => {
    setIsEditBaby(true);
    reset({
      babyId: record.babyId ?? null,
      babyName: record.babyName,
      babySurname: record?.babySurname ?? "",
      birthDate: record?.birthDate ?? null,
      numberOfMonths: record.numberOfMonths,
      phoneNumber: record.phoneNumber,
      motherName: record?.motherName ?? "",
      note: record?.note ?? "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (babyId?: number | null) => {
    if (babyId) {
      setLoading(true);
      try {
        await deleteBaby(babyId);
        const result = await getBabies(cursor - 1, null);
        setBabies(result.data.content);
        setTotalElements(result.data.totalElements);
        toastSuccessNotification("Obrisano!");
      } catch (e) {
        errorResponse(e);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleModalCancel = () => {
    reset({
      babyId: null,
      babyName: "",
      babySurname: "",
      birthDate: null,
      numberOfMonths: 0,
      phoneNumber: "",
      motherName: "",
      note: "",
    });
    setIsEditBaby(false);
    setIsModalOpen(false);
  };

  const handleCreateModal = () => {
    reset({
      babyId: null,
      babyName: "",
      babySurname: "",
      birthDate: null,
      numberOfMonths: 0,
      phoneNumber: "",
      motherName: "",
      note: "",
    });
    setIsEditBaby(false);
    setIsModalOpen(true);
  };

  const nextPage = (page: number) => {
    setCursor(page);
  };

  const handleOpenInfoModal = (note: string) => {
    setCurrentNote(note);
    setIsInfoModalVisible(true);
  };

  const handleCloseInfoModal = () => {
    setIsInfoModalVisible(false);
    setCurrentNote("");
  };

  const onSubmit: SubmitHandler<BabyInterface> = async (data) => {
    setLoading(true);
    try {
      if (isEditBaby) {
        const res = await editBaby(data);
        setBabies((prevBabies) =>
          prevBabies.map((baby) =>
            baby.babyId == data.babyId ? { ...baby, ...res.data.data } : baby
          )
        );
        setIsModalOpen(false);
        toastSuccessNotification("Ažurirano!");
      } else {
        await addBaby(data);
        const result = await getBabies(cursor - 1, null);
        setBabies(result.data.content);
        setTotalElements(result.data.totalElements);
        setIsModalOpen(false);
        toastSuccessNotification("Sačuvano!");
      }
    } catch (e) {
      errorResponse(e);
    } finally {
      setLoading(false);
    }
  };

  //------------------RENDER------------------

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 24 },
  };

  const columns: ColumnsType<BabyInterface> = [
    {
      title: "Ime",
      dataIndex: "babyName",
      key: "babyName",
    },
    {
      title: "Prezime",
      dataIndex: "babySurname",
      key: "babySurname",
      render: (value) => {
        return value ? value : "Nema podatka";
      },
    },
    {
      title: "Datum rođenja",
      dataIndex: "birthDate",
      key: "birthDate",
      render: (value) => {
        return value
          ? dayjs(value).format("DD.MM.YYYY.") + " godine"
          : "Nema podatka";
      },
    },
    {
      title: "Broj mjeseci",
      dataIndex: "numberOfMonths",
      key: "numberOfMonths",
    },
    {
      title: "Telefon",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Ime majke",
      dataIndex: "motherName",
      key: "motherName",
      render: (value) => {
        return value ? value : "Nema podatka";
      },
    },
    {
      title: "Bilješka",
      dataIndex: "note",
      key: "note",
      render: (value) => {
        const previewText =
          value.length > 3 ? value.slice(0, 3) + "..." : value;

        return (
          <span
            onClick={() => handleOpenInfoModal(value)}
            style={{ cursor: "pointer", color: "#1890ff" }}
          >
            {previewText}
          </span>
        );
      },
    },
    {
      title: "Uredi",
      key: "actions",
      render: (_, record) => (
        <>
          <EditOutlined
            style={{ marginRight: 16 }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Da li ste sigurni da želite obrisati ovu bebu?"
            onConfirm={() => handleDelete(record.babyId)}
            okText="Da"
            cancelText="Ne"
          >
            <DeleteOutlined style={{ color: "red" }} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <InfoModal
        visible={isInfoModalVisible}
        onClose={handleCloseInfoModal}
        fullText={currentNote}
      />
      <Modal
        title={isEditBaby ? "Uredi bebu" : "Dodaj novu bebu"}
        maskClosable={false}
        open={isModalOpen}
        footer={null}
        onCancel={handleModalCancel}
      >
        <Form onFinish={handleSubmit(onSubmit)} {...layout}>
          <Form.Item
            label="Ime"
            validateStatus={errors.babyName ? "error" : ""}
            help={errors.babyName?.message}
          >
            <Controller
              name="babyName"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Prezime"
            validateStatus={errors.babySurname ? "error" : ""}
            help={errors.babySurname?.message}
          >
            <Controller
              name="babySurname"
              control={control}
              render={({ field }) => (
                <Input {...field} value={field.value ?? ""} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Datum rođenja"
            validateStatus={errors.birthDate ? "error" : ""}
            help={errors.birthDate?.message}
          >
            <Controller
              name="birthDate"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  value={value ? dayjs(value, "YYYY-MM-DD") : null}
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

          <Form.Item
            label="Broj mjeseci"
            validateStatus={errors.numberOfMonths ? "error" : ""}
            help={errors.numberOfMonths?.message}
          >
            <Controller
              name="numberOfMonths"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} min={0} style={{ width: "100%" }} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Broj telefona"
            validateStatus={errors.phoneNumber ? "error" : ""}
            help={errors.phoneNumber?.message}
          >
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Ime majke"
            validateStatus={errors.motherName ? "error" : ""}
            help={errors.motherName?.message}
          >
            <Controller
              name="motherName"
              control={control}
              render={({ field }) => (
                <Input {...field} value={field.value ?? ""} />
              )}
            />
          </Form.Item>

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
            <Button type="primary" htmlType="submit">
              Sačuvaj
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div style={{ maxWidth: "100%", padding: "16px" }}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
        >
          <Button
            type="primary"
            onClick={handleCreateModal}
            style={{ marginBottom: 16 }}
          >
            Dodaj Bebu
          </Button>
        </div>
        <FilterComponent
          showSearch={true}
          showRangePicker={true}
          showTimeInRangePicker={false}
        />
        <Table
          columns={columns}
          loading={loading}
          dataSource={babies}
          rowKey="babyId"
          pagination={{
            current: cursor,
            pageSize: DEFAULT_PAGE_SIZE,
            total: totalElements,
            onChange: nextPage,
          }}
        />
      </div>
    </>
  );
};

export default BabyPage;
