import { useEffect, useState } from "react";
import "./ReportPage.scss";
import {
  getReservationDailyReports,
  getServicePackageDailyReports,
  generateReport,
} from "../../services/ReportService";
import { ReservationDailyReportInterface } from "../../interfaces/ReservationDailyReportInterface";
import { useFilter } from "../../context/Filter/useFilter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import { Modal, Tabs, FloatButton, Button, Checkbox, DatePicker } from "antd";
import { ServicePackageDailyReportInterface } from "../../interfaces/ServicePackageDailyReportInterface";
import CustomTooltipReservationReport from "../../components/CustomTooltipReservationReport";
import CustomTooltipServicePackageReport from "../../components/CustomTooltipServicePackageReport";
import dayjs, { Dayjs } from "dayjs";
import type { CheckboxProps } from "antd";
import { toastSuccessNotification } from "../../util/toastNotification";
import { groupDataReportType } from "../../util/const";

const ReportPage = () => {
  const [reservationDailyReport, setReservationDailyReport] = useState<
    ReservationDailyReportInterface[]
  >([]);

  const [servicePackageDailyReport, setServicePackageDailyReport] = useState<
    ServicePackageDailyReportInterface[]
  >([]);
  const [sumOnXAxesServicePackages, setSumOnXAxesServicePackages] =
    useState<number>(0);
  const [sumOnXAxesReservations, setSumOnXAxesReservations] =
    useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [activeTabKey, setActiveTabKey] = useState<string>(
    "reservationReportTab"
  );
  const [generateAllDays, setGenerateAllDays] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const { filter, setFilter } = useFilter();

  //------------------LIFECYCLE------------------

  useEffect(() => {
    if (filter?.groupDataType) {
      getReservationDailyReports(filter).then((res) => {
        setReservationDailyReport(res);
      });
      getServicePackageDailyReports(filter).then((res) => {
        setServicePackageDailyReport(res);
      });
    }
  }, [filter]);

  useEffect(() => {
    const totalReservations = reservationDailyReport.reduce(
      (total, reservation) => {
        return total + reservation.numberOfReservation;
      },
      0
    );
    const totalServicePackages = servicePackageDailyReport.reduce(
      (total, reservation) => {
        return total + reservation.numberOfUsedPackages;
      },
      0
    );
    setSumOnXAxesReservations(totalReservations);
    setSumOnXAxesServicePackages(totalServicePackages);
  }, [reservationDailyReport, servicePackageDailyReport]);

  //------------------METHODS------------------

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
    setFilter({
      groupDataType: groupDataReportType.find((x) => (x.value = "day"))?.value,
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancelReportModal = () => {
    setActiveTabKey("reservationReportTab");
    setIsModalVisible(false);
    setGenerateAllDays(false);
    setSelectedDate(null);
  };

  const handleCheckboxChange: CheckboxProps["onChange"] = (e) => {
    setGenerateAllDays(e.target.checked);
    if (e.target.checked == true) {
      setSelectedDate(null);
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const handleSubmitReportModal = () => {
    generateReport(
      generateAllDays,
      selectedDate?.format("YYYY-MM-DDTHH:mm:ss")
    ).then(() => {
      toastSuccessNotification("Generisani izvještaji spremni za prikaz!");
      setFilter({
        groupDataType: groupDataReportType.find((x) => (x.value = "day"))
          ?.value,
      });
      getReservationDailyReports(null).then((res) =>
        setReservationDailyReport(res)
      );
      getServicePackageDailyReports(null).then((res) =>
        setServicePackageDailyReport(res)
      );
    });
    setGenerateAllDays(false);
    setSelectedDate(null);
    handleCancelReportModal();
  };

  const disableTodayAndFuture = (current: Dayjs) => {
    return current.isSame(dayjs(), "day") || current.isAfter(dayjs(), "day");
  };

  //------------------RENDER------------------

  return (
    <>
      <Modal
        title={<div style={{ textAlign: "center" }}>Generiši izvještaje</div>}
        maskClosable={false}
        open={isModalVisible}
        onCancel={handleCancelReportModal}
        width={400}
        footer={[
          <Button key="back" onClick={handleCancelReportModal}>
            Odustani
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmitReportModal}
            disabled={!generateAllDays && !selectedDate}
          >
            Generiši
          </Button>,
        ]}
      >
        <Checkbox
          checked={generateAllDays}
          onChange={handleCheckboxChange}
          style={{ width: "100%" }}
        >
          Generiši izvještaje za sve dane
        </Checkbox>
        <br />
        <DatePicker
          onChange={handleDateChange}
          value={selectedDate}
          format={"DD.MM.YYYY."}
          style={{ marginTop: "16px", width: "100%" }}
          disabled={generateAllDays}
          disabledDate={disableTodayAndFuture}
        />
      </Modal>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Tabs
          defaultActiveKey="reservationReportTab"
          activeKey={activeTabKey}
          onChange={handleTabChange}
          items={[
            {
              key: "reservationReportTab",
              label: "Grafički izvještaj za rezervacije",
              children: (
                <>
                  <FilterComponent
                    showSelectBebies={true}
                    showStatusSelect={true}
                    showRangePicker={true}
                    showTimeInRangePicker={true}
                    showGroupReportData={true}
                    statusTypeCode="reservation"
                  />
                  {reservationDailyReport.length > 0 ? (
                    <>
                      <div style={{ margin: "20px 0", textAlign: "center" }}>
                        <h3>Ukupno rezervacija: {sumOnXAxesReservations}</h3>
                        <p>
                          Ova cifra predstavlja ukupan broj rezervacija za
                          izabrani vremenski period.
                        </p>
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reservationDailyReport}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip
                            content={<CustomTooltipReservationReport />}
                          />
                          <Bar dataKey="numberOfReservation" fill="#1890ff" />
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <div className="no-data-message">
                      <p className="message-color">
                        Nema podataka za odabrani filter
                      </p>
                    </div>
                  )}
                </>
              ),
            },
            {
              key: "servicePackageReportTab",
              label: "Grafički izvještaj za pakete usluga",
              children: (
                <>
                  <FilterComponent
                    showSelectServicePackages={true}
                    showRangePicker={true}
                    showTimeInRangePicker={true}
                    showGroupReportData={true}
                  />
                  {servicePackageDailyReport.length > 0 ? (
                    <>
                      <div style={{ margin: "20px 0", textAlign: "center" }}>
                        <h3>
                          Ukupno korištenih paketa: {sumOnXAxesServicePackages}
                        </h3>
                        <p>
                          Ova cifra predstavlja ukupan broj iskorištenih paketa
                          usluga za izabrani vremenski period.
                        </p>
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={servicePackageDailyReport}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip
                            content={<CustomTooltipServicePackageReport />}
                          />
                          <Bar dataKey="numberOfUsedPackages" fill="#1890ff" />
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <div className="no-data-message">
                      <p className="message-color">
                        Nema podataka za odabrani filter
                      </p>
                    </div>
                  )}
                </>
              ),
            },
          ]}
        />

        <FloatButton
          onClick={showModal}
          tooltip={<div>Generiši izvještaje</div>}
          type="primary"
          style={{ width: "50px", height: "50px" }}
        />
      </div>
    </>
  );
};

export default ReportPage;
