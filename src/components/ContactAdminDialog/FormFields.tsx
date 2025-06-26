
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormData {
  name: string;
  email: string;
  company: string;
  interestLevel: string;
  experience: string;
  timeline: string;
  message: string;
}

interface FormFieldsProps {
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
}

const FormFields = ({ formData, onFormDataChange }: FormFieldsProps) => {
  const updateField = (field: keyof FormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="company">Company/Organization</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => updateField('company', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="interestLevel">Level of Interest *</Label>
        <Select value={formData.interestLevel} onValueChange={(value) => updateField('interestLevel', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your interest level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High - Ready to proceed immediately</SelectItem>
            <SelectItem value="medium">Medium - Evaluating options</SelectItem>
            <SelectItem value="low">Low - Just gathering information</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="experience">SBIR Experience *</Label>
        <Select value={formData.experience} onValueChange={(value) => updateField('experience', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your SBIR experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No prior SBIR experience</SelectItem>
            <SelectItem value="some">Some SBIR experience</SelectItem>
            <SelectItem value="extensive">Extensive SBIR experience</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="timeline">Expected Timeline *</Label>
        <Select value={formData.timeline} onValueChange={(value) => updateField('timeline', value)}>
          <SelectTrigger>
            <SelectValue placeholder="When would you like to proceed?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="immediate">Immediately</SelectItem>
            <SelectItem value="1-2weeks">Within 1-2 weeks</SelectItem>
            <SelectItem value="1month">Within 1 month</SelectItem>
            <SelectItem value="3months">Within 3 months</SelectItem>
            <SelectItem value="exploring">Just exploring options</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="message">Additional Questions or Comments</Label>
        <Textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) => updateField('message', e.target.value)}
          placeholder="Tell us more about your specific interests or questions regarding this SBIR technology..."
        />
      </div>
    </>
  );
};

export default FormFields;
export type { FormData };
