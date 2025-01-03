import { useEffect, useRef, useState } from "react";
import { ServicePackageInterface } from "../../interfaces/ServicePackageInterface";
import {
  addServicePackage,
  deleteServicePackage,
  editServicePackage,
  getServicePackages,
} from "../../services/ServicePackageService";
import {
  toastErrorNotification,
  toastSuccessNotification,
} from "../../util/toastNotification";
import {
  Button,
  Table,
  Popconfirm,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import { DEFAULT_PAGE_SIZE, errorResponse } from "../../util/const";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getServicePackageValidationSchema } from "../../validations/ServicePackageValidationSchema";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InfoModal from "../../components/InfoModal/InfoModal";
import { useFilter } from "../../context/Filter/useFilter";
import { AxiosError } from "axios";
import HeaderButtonsComponent from "../../components/HeaderButtonsComponent/HeaderButtonsComponent";
import { existsByServicePackageId } from "../../services/ArrangementService";

const ServicePackagePage = () => {
  const isModalOpen = useRef<boolean>(false);
  const isInfoModalVisible = useRef<boolean>(false);
  const [cursor, setCursor] = useState<number>(1);
  const [servicePackages, setServicePackages] = useState<
    ServicePackageInterface[]
  >([]);
  const [totalElements, setTotalElements] = useState<number>();
  const [isEditServicePackage, setIsEditServicePackage] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [existsByServicePackage, setExistsByServicePackage] =
    useState<boolean>(false);
  const [currentNote, setCurrentNote] = useState<string>("");
  const schema = getServicePackageValidationSchema(isEditServicePackage);
  const { filter } = useFilter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServicePackageInterface>({
    resolver: yupResolver(schema),
  });

  //------------------LIFECYCLE------------------

  useEffect(() => {
    getServicePackages(cursor - 1, filter)
      .then((result) => {
        setServicePackages(result.data.content);
        setTotalElements(result.data.totalElements);
        setLoading(false);
      })
      .catch((e) => {
        toastErrorNotification(e.response.data.message);
      });
  }, [cursor, filter]);

  //------------------METHODS----------------

  const nextPage = (page: number) => {
    setCursor(page);
  };

  const handleEdit = async (record: ServicePackageInterface) => {
    setIsEditServicePackage(true);
    try {
      if (record.servicePackageId) {
        const res = await existsByServicePackageId(record.servicePackageId);
        setExistsByServicePackage(res);
      }
    } catch (e) {
      errorResponse(e);
    }
    reset({
      servicePackageId: record.servicePackageId,
      servicePackageName: record.servicePackageName,
      termNumber: record.termNumber,
      servicePackageDurationDays: record.servicePackageDurationDays,
      price: record.price,
      note: record?.note ?? "",
    });
    isModalOpen.current = true;
  };

  const handleDelete = async (servicePackageId?: number | null) => {
    if (servicePackageId) {
      setLoading(true);
      try {
        await deleteServicePackage(servicePackageId);
        const result = await getServicePackages(cursor - 1, null);
        setServicePackages(result.data.content);
        setTotalElements(result.data.totalElements);
        toastSuccessNotification("Obrisano!");
      } catch (e) {
        if (e instanceof AxiosError) {
          const errorMessage = e.response?.data?.message;
          toastErrorNotification(errorMessage);
        } else {
          toastErrorNotification("Došlo je do greške.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleModalCancel = () => {
    reset({
      servicePackageId: null,
      servicePackageName: "",
      termNumber: 0,
      servicePackageDurationDays: 0,
      price: 0,
      note: "",
    });
    setIsEditServicePackage(false);
    setExistsByServicePackage(false);
    isModalOpen.current = false;
  };

  const handleCreateModal = () => {
    reset({
      servicePackageId: null,
      servicePackageName: "",
      termNumber: 0,
      servicePackageDurationDays: 0,
      price: 0,
      note: "",
    });
    setIsEditServicePackage(false);
    isModalOpen.current = true;
  };

  const handleOpenInfoModal = (note: string) => {
    setCurrentNote(note);
    isInfoModalVisible.current = true;
  };

  const handleCloseInfoModal = () => {
    isInfoModalVisible.current = false;
    setCurrentNote("");
  };

  const onSubmit: SubmitHandler<ServicePackageInterface> = async (data) => {
    setLoading(true);
    try {
      if (isEditServicePackage) {
        const res = await editServicePackage(data);
        setServicePackages((prev) =>
          prev.map((item) =>
            item.servicePackageId === data.servicePackageId
              ? { ...item, ...res.data.data }
              : item
          )
        );
        isModalOpen.current = false;
        toastSuccessNotification("Ažurirano!");
      } else {
        await addServicePackage(data);
        const result = await getServicePackages(cursor - 1, null);
        setServicePackages(result.data.content);
        setTotalElements(result.data.totalElements);
        isModalOpen.current = false;
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
    labelCol: { span: 9 },
    wrapperCol: { span: 15 },
  };

  const columns: ColumnsType<ServicePackageInterface> = [
    {
      title: "ID paketa usluge",
      dataIndex: "servicePackageId",
      key: "servicePackageId",
    },
    {
      title: "Naziv paketa usluge",
      dataIndex: "servicePackageName",
      key: "servicePackageName",
    },
    {
      title: "Broj termina",
      dataIndex: "termNumber",
      key: "termNumber",
      render: (value) => {
        return value ? value : "Nema podatka";
      },
    },
    {
      title: "Trajanje paketa u danima",
      dataIndex: "servicePackageDurationDays",
      key: "servicePackageDurationDays",
      render: (value) => {
        return value ? value : "Nema podatka";
      },
    },
    {
      title: "Cijena u KM",
      dataIndex: "price",
      key: "price",
      render: (value) => {
        return value ? value.toFixed(2) : "Nema podatka";
      },
    },
    {
      title: "Bilješka",
      dataIndex: "note",
      key: "note",
      render: (value) => {
        const previewText =
          value?.length > 3 ? value.slice(0, 3) + "..." : value;

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
      title: "Akcije",
      key: "actions",
      render: (_, record) => (
        <>
          <EditOutlined
            title="Uredi"
            style={{ marginRight: 16 }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Da li ste sigurni da želite izbrisati ovaj paket usluge?"
            onConfirm={() => handleDelete(record.servicePackageId)}
            okText="Da"
            cancelText="Ne"
          >
            <DeleteOutlined style={{ color: "red" }} title="Izbriši" />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <InfoModal
        visible={isInfoModalVisible.current}
        onClose={handleCloseInfoModal}
        fullText={currentNote}
      />
      <Modal
        title={
          isEditServicePackage ? (
            <div style={{ textAlign: "center" }}>Uredi paket usluge</div>
          ) : (
            <div style={{ textAlign: "center" }}>Dodaj novi paket usluge</div>
          )
        }
        maskClosable={false}
        open={isModalOpen.current}
        footer={null}
        onCancel={handleModalCancel}
      >
        <Form onFinish={handleSubmit(onSubmit)} {...layout}>
          <Form.Item
            label="Naziv paketa usluge"
            validateStatus={errors.servicePackageName ? "error" : ""}
            help={errors.servicePackageName?.message}
          >
            <Controller
              name="servicePackageName"
              control={control}
              render={({ field }) => (
                <Input {...field} disabled={existsByServicePackage} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Broj termina"
            validateStatus={errors.termNumber ? "error" : ""}
            help={errors.termNumber?.message}
          >
            <Controller
              name="termNumber"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0}
                  style={{ width: "100%" }}
                  disabled={existsByServicePackage}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Broj dana trajanja paketa"
            validateStatus={errors.servicePackageDurationDays ? "error" : ""}
            help={errors.servicePackageDurationDays?.message}
          >
            <Controller
              name="servicePackageDurationDays"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0}
                  style={{ width: "100%" }}
                  disabled={existsByServicePackage}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Cijena"
            validateStatus={errors.price ? "error" : ""}
            help={errors.price?.message}
          >
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0}
                  step={0.01}
                  style={{ width: "100%" }}
                />
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
        <HeaderButtonsComponent
          buttonTitle="Dodaj paket usluge"
          onButtonAction={handleCreateModal}
        />
        <FilterComponent showSearch={true} showPriceSlider={true} />
        <Table
          columns={columns}
          loading={loading}
          dataSource={servicePackages}
          rowKey="servicePackageId"
          locale={{
            emptyText: "Nema podataka za prikazati",
          }}
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

export default ServicePackagePage;
