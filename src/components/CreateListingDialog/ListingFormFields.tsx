
import { UseFormReturn } from "react-hook-form";
import { ListingFormData } from "./listingSchema";
import TitleField from "./TitleField";
import DescriptionField from "./DescriptionField";
import PhaseAgencyFields from "./PhaseAgencyFields";
import ValueDeadlineFields from "./ValueDeadlineFields";
import CategoryField from "./CategoryField";

interface ListingFormFieldsProps {
  form: UseFormReturn<ListingFormData>;
}

const ListingFormFields = ({ form }: ListingFormFieldsProps) => {
  return (
    <>
      <TitleField form={form} />
      <DescriptionField form={form} />
      <PhaseAgencyFields form={form} />
      <ValueDeadlineFields form={form} />
      <CategoryField form={form} />
    </>
  );
};

export default ListingFormFields;
