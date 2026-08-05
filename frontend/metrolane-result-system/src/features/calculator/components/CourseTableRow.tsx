import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import type { CourseRecord } from "@/features/calculator/types";
import { courseRecordSchema } from "@/features/calculator/utils/validation";
import {
  computeTotalScore,
  getGradeFromScore,
  getGradePoint,
} from "@/features/result-sheet/utils/resultHelpers";

interface CourseTableRowProps {
  course: CourseRecord;
  onUpdate: (id: string, updates: Partial<CourseRecord>) => void;
  onDelete: (id: string) => void;
  onToggleEdit: (id: string, isEditing: boolean) => void;
}

export function CourseTableRow({
  course,
  onUpdate,
  onDelete,
  onToggleEdit,
}: CourseTableRowProps) {
  const [draft, setDraft] = useState({
    courseCode: course.courseCode,
    courseTitle: course.courseTitle,
    creditUnit: course.creditUnit,
    continuousAssessment: course.continuousAssessment,
    examinationScore: course.examinationScore,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: keyof typeof draft, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSave = () => {
    const result = courseRecordSchema.safeParse(draft);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string") {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    onUpdate(course.id, { ...draft, isEditing: false });
    onToggleEdit(course.id, false);
  };

  const handleCancel = () => {
    const isNew =
      !course.courseCode &&
      !course.courseTitle &&
      !course.creditUnit &&
      !course.continuousAssessment &&
      !course.examinationScore;

    if (isNew) {
      onDelete(course.id);
      return;
    }

    setDraft({
      courseCode: course.courseCode,
      courseTitle: course.courseTitle,
      creditUnit: course.creditUnit,
      continuousAssessment: course.continuousAssessment,
      examinationScore: course.examinationScore,
    });
    setErrors({});
    onToggleEdit(course.id, false);
  };

  const handleEdit = () => {
    setDraft({
      courseCode: course.courseCode,
      courseTitle: course.courseTitle,
      creditUnit: course.creditUnit,
      continuousAssessment: course.continuousAssessment,
      examinationScore: course.examinationScore,
    });
    onToggleEdit(course.id, true);
  };

  const sourceValues = course.isEditing ? draft : course;
  const totalScore = computeTotalScore(
    sourceValues.continuousAssessment,
    sourceValues.examinationScore,
  );
  const grade =
    totalScore === "--" ? "--" : getGradeFromScore(Number(totalScore));
  const gradePoint =
    totalScore === "--" ? "--" : String(getGradePoint(Number(totalScore)));

  if (course.isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            value={draft.courseCode}
            onChange={(e) => handleFieldChange("courseCode", e.target.value)}
            placeholder="e.g. CHS101"
            className="min-w-[100px]"
          />
          {errors.courseCode && (
            <p className="mt-1 text-xs text-red-500">{errors.courseCode}</p>
          )}
        </TableCell>
        <TableCell>
          <Input
            value={draft.courseTitle}
            onChange={(e) => handleFieldChange("courseTitle", e.target.value)}
            placeholder="Course title"
            className="min-w-[160px]"
          />
          {errors.courseTitle && (
            <p className="mt-1 text-xs text-red-500">{errors.courseTitle}</p>
          )}
        </TableCell>
        <TableCell>
          <Input
            type="number"
            min={0}
            value={draft.creditUnit}
            onChange={(e) => handleFieldChange("creditUnit", e.target.value)}
            placeholder="CU"
            className="w-20"
          />
          {errors.creditUnit && (
            <p className="mt-1 text-xs text-red-500">{errors.creditUnit}</p>
          )}
        </TableCell>
        <TableCell>
          <Input
            type="number"
            min={0}
            max={40}
            value={draft.continuousAssessment}
            onChange={(e) =>
              handleFieldChange("continuousAssessment", e.target.value)
            }
            placeholder="0–40"
            className="w-20"
          />
          {errors.continuousAssessment && (
            <p className="mt-1 text-xs text-red-500">
              {errors.continuousAssessment}
            </p>
          )}
        </TableCell>
        <TableCell>
          <Input
            type="number"
            min={0}
            max={60}
            value={draft.examinationScore}
            onChange={(e) =>
              handleFieldChange("examinationScore", e.target.value)
            }
            placeholder="0–60"
            className="w-20"
          />
          {errors.examinationScore && (
            <p className="mt-1 text-xs text-red-500">
              {errors.examinationScore}
            </p>
          )}
        </TableCell>
        <TableCell className="font-medium text-gray-900">
          {totalScore}
        </TableCell>
        <TableCell className="font-medium text-gray-900">{grade}</TableCell>
        <TableCell className="font-medium text-gray-900">
          {gradePoint}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              aria-label="Save course"
              className="text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              aria-label="Cancel editing"
              className="text-gray-500 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className="font-medium text-gray-900">
        {course.courseCode || "—"}
      </TableCell>
      <TableCell>{course.courseTitle || "—"}</TableCell>
      <TableCell>{course.creditUnit || "—"}</TableCell>
      <TableCell>{course.continuousAssessment || "—"}</TableCell>
      <TableCell>{course.examinationScore || "—"}</TableCell>
      <TableCell className="font-medium text-gray-900">{totalScore}</TableCell>
      <TableCell className="font-medium text-gray-900">{grade}</TableCell>
      <TableCell className="font-medium text-gray-900">{gradePoint}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            aria-label="Edit course"
            className="text-orange-500 hover:bg-orange-50 hover:text-orange-600"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(course.id)}
            aria-label="Delete course"
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
