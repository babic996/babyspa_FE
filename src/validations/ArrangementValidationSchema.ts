import * as yup from "yup";

export const getArrangementValidationSchema = (isUpdate: boolean) => {
  return yup.object().shape({
    arrangementId: yup
      .number()
      .nullable()
      .when([], {
        is: () => isUpdate,
        then: (schema) => schema.required("ID bebe je obavezan"),
        otherwise: (schema) => schema.nullable(),
      }),
    note: yup.string().nullable().optional(),
    discountId: yup.number().nullable().optional(),
    babyId: yup
      .number()
      .min(1, "Odabir bebe je obavezan.")
      .required("Odabir bebe je obavezan."),
    statusId: yup
      .number()
      .nullable()
      .when([], {
        is: () => isUpdate,
        then: (schema) => schema.required("Status je obavezan."),
        otherwise: (schema) => schema.nullable(),
      }),
    servicePackageId: yup
      .number()
      .min(1, "Paket usluge je obavezan.")
      .required("Paket usluge je obavezan."),
    paymentTypeId: yup.number().nullable().optional(),
    extendDurationDays: yup.number().nullable().optional(),
  });
};
