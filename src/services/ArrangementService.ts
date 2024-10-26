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

  const result = await request({
    url: `/arrangement/find-all?page=${cursor}&size=${DEFAULT_PAGE_SIZE}${filterString}`,
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
