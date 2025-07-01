
import TitleField from "./TitleField";
import DescriptionField from "./DescriptionField";
import PhaseAgencyFields from "./PhaseAgencyFields";
import ValueDeadlineFields from "./ValueDeadlineFields";
import CategoryField from "./CategoryField";
import TechnologySummaryField from "./TechnologySummaryField";
import type { UseFormReturn } from "react-hook-form";

interface ListingFormFieldsProps {
  form: UseFormReturn<any>;
}

const ListingFormFields = ({ form }: ListingFormFieldsProps) => {
  return (
    <>
      <TitleField form={form} />
      <DescriptionField form={form} />
      <PhaseAgencyFields form={form} />
      <ValueDeadlineFields form={form} />
      <CategoryField form={form} />
      <TechnologySummaryField form={form} />
    </>
  );
};

export default ListingFormFields;
