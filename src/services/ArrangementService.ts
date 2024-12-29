import { baseRequest } from "../util/useAxios";
import { DEFAULT_PAGE_SIZE } from "../util/const";
import { CreateOrUpdateArrangementInterface } from "../interfaces/ArrangementInterface";
import { FilterInterface } from "../interfaces/FilterInterface";

export const getArrangements = async (
  cursor: number | null,
  filter: FilterInterface | null
) => {
  const request = baseRequest();
  let filterString = "";

  if (filter?.remainingTerm != undefined) {
    filterString += `&remainingTerm=${filter.remainingTerm}`;
  }

  if (filter?.startPrice) {
    filterString += `&startPrice=${filter.startPrice}`;
  }

  if (filter?.endPrice) {
    filterString += `&endPrice=${filter.endPrice}`;
  }

  if (filter?.babyId) {
    filterString += `&babyId=${filter.babyId}`;
  }

  if (filter?.paymentTypeId) {
    filterString += `&paymentTypeId=${filter.paymentTypeId}`;
  }

  if (filter?.servicePackageId) {
    filterString += `&servicePackageId=${filter.servicePackageId}`;
  }

  if (filter?.statusId) {
    filterString += `&statusId=${filter.statusId}`;
  }

  if (filter?.arrangementId) {
    filterString += `&arrangementId=${filter.arrangementId}`;
  }

  const result = await request({
    url: `/arrangement/find-all?page=${cursor}&size=${DEFAULT_PAGE_SIZE}${filterString}`,
    method: "get",
  });

  return result?.data;
};

export const getArrangementsPrice = async (filter: FilterInterface | null) => {
  const request = baseRequest();
  const params = new URLSearchParams();

  if (filter?.remainingTerm != undefined) {
    params.append("remainingTerm", filter.remainingTerm.toString());
  }

  if (filter?.startPrice) {
    params.append("startPrice", filter.startPrice.toString());
  }

  if (filter?.endPrice) {
    params.append("endPrice", filter.endPrice.toString());
  }

  if (filter?.babyId) {
    params.append("babyId", filter.babyId.toString());
  }

  if (filter?.paymentTypeId) {
    params.append("paymentTypeId", filter.paymentTypeId.toString());
  }

  if (filter?.servicePackageId) {
    params.append("servicePackageId", filter.servicePackageId.toString());
  }

  if (filter?.statusId) {
    params.append("statusId", filter.statusId.toString());
  }

  if (filter?.arrangementId) {
    params.append("arrangementId", filter.arrangementId.toString());
  }

  const result = await request({
    url: `/arrangement/find-price?${params.toString()}`,
    method: "get",
  });

  return result?.data;
};

export const getArrangementsList = async () => {
  const request = baseRequest();

  const result = await request({
    url: "/arrangement/find-all-list",
    method: "get",
  });

  return result?.data.data;
};

export const addArrangement = (data: CreateOrUpdateArrangementInterface) => {
  const request = baseRequest();

  return request({ url: "/arrangement/save", method: "post", data: data });
};

export const editArrangement = (data: CreateOrUpdateArrangementInterface) => {
  const request = baseRequest();

  return request({ url: "/arrangement/update", method: "put", data: data });
};

export const deleteArrangement = (arrangementId: number) => {
  const request = baseRequest();

  return request({
    url: `/arrangement/delete?arrangementId=${arrangementId}`,
    method: "delete",
  });
};

export const existsByServicePackageId = async (servicePackageId: number) => {
  const request = baseRequest();

  const result = await request({
    url: `/arrangement/exists-by-service-package-id?servicePackageId=${servicePackageId}`,
    method: "get",
  });

  return result?.data.data;
};
