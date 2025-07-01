
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { ExportOptionsProps } from "./types";

export const ExportOptionsSection = ({
  exportFormat,
  setExportFormat,
  exportFields,
  setExportFields
}: ExportOptionsProps) => {
  const handleSelectAllFields = (checked: boolean) => {
    setExportFields(prev => Object.keys(prev).reduce((acc, key) => {
      acc[key as keyof typeof prev] = checked;
      return acc;
    }, {} as typeof prev));
  };

  const selectedFieldsCount = Object.values(exportFields).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Export Options</h3>
      
      <div>
        <Label>Export Format</Label>
        <Select value={exportFormat} onValueChange={(value: "csv" | "json") => setExportFormat(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
            <SelectItem value="json">JSON (JavaScript Object Notation)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Fields to Export</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedFieldsCount === Object.keys(exportFields).length}
              onCheckedChange={handleSelectAllFields}
            />
            <Label htmlFor="select-all" className="text-sm">Select All</Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="title"
              checked={exportFields.title}
              onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, title: !!checked }))}
            />
            <Label htmlFor="title">Title</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="description"
              checked={exportFields.description}
              onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, description: !!checked }))}
            />
            <Label htmlFor="description">Description</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="agency"
              checked={exportFields.agency}
              onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, agency: !!checked }))}
            />
            <Label htmlFor="agency">Agency</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="phase"
              checked={exportFields.phase}
              onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, phase: !!checked }))}
            />
            <Label htmlFor="phase">Phase</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="value"
              checked={exportFields.value}
              onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, value: !!checked }))}
            />
            <Label htmlFor="value">Value</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="deadline"
              checked={exportFields.deadline}
              onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, deadline: !!checked }))}
            />
            <Label htmlFor="deadline">Deadline</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="category"
              checked={exportFields.category}
              onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, category: !!checked }))}
            />
            <Label htmlFor="category">Category</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="status"
              checked={exportFields.status}
              onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, status: !!checked }))}
            />
            <Label htmlFor="status">Status</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="submittedAt"
              checked={exportFields.submittedAt}
              onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, submittedAt: !!checked }))}
            />
            <Label htmlFor="submittedAt">Submitted Date</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="userInfo"
              checked={exportFields.userInfo}
              onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, userInfo: !!checked }))}
            />
            <Label htmlFor="userInfo">User Info</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="photoUrl"
              checked={exportFields.photoUrl}
              onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, photoUrl: !!checked }))}
            />
            <Label htmlFor="photoUrl">Photo URL</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="dateSold"
              checked={exportFields.dateSold}
              onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, dateSold: !!checked }))}
            />
            <Label htmlFor="dateSold">Date Sold</Label>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          {selectedFieldsCount} of {Object.keys(exportFields).length} fields selected
        </div>
      </div>
    </div>
  );
};
