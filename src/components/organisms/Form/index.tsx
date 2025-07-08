"use client";

import React, { useRef, useState } from "react";
import Button from "@/components/atoms/button";
import TextArea from "@/components/atoms/input/textArea";
import Input from "@/components/atoms/input/input";

interface BaseField {
  label: string;
  placeholder?: string;
  name: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  validate?: (value: string) => boolean;
  errorMessage?: string;
  colSpan?: number; // For grid layout
}

interface TextAreaField extends BaseField {
  type: "textarea" | "subtitle";
}

interface SelectField extends BaseField {
  type: "select";
  options: { value: string; label: string }[];
}

interface FileField extends BaseField {
  type: "image" | "file";
}

interface InputField extends BaseField {
  type?: string;
}

type Field = TextAreaField | SelectField | FileField | InputField;

interface FormContainerProps {
  formTitle?: string;
  primaryButton?: string;
  secondaryButton?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  width?: "full" | "partial";
  onSubmit?: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

interface FormProps extends Omit<FormContainerProps, "children"> {
  fields: Field[];
}

const FormContainer: React.FC<FormContainerProps> = ({
  formTitle,
  primaryButton,
  secondaryButton,
  onPrimaryClick,
  onSecondaryClick,
  width = "full",
  onSubmit,
  children,
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={onSubmit}
        className={`${
          width === "full" ? "max-w-7xl" : "max-w-4xl"
        } w-full bg-white rounded-3xl shadow-xl border p-8 sm:p-12`}
        ref={formRef}
      >
        {formTitle && (
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            {formTitle}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {children}
        </div>

        {(primaryButton || secondaryButton) && (
          <div className="mt-12 flex flex-wrap gap-4 justify-end">
            {secondaryButton && (
              <Button
                text={secondaryButton}
                onClick={onSecondaryClick}
                className="text-lg px-8 py-3"
              />
            )}
            {primaryButton && (
              <Button
                text={primaryButton}
                onClick={onPrimaryClick}
                className="text-lg px-8 py-3"
              />
            )}
          </div>
        )}
      </form>
    </div>
  );
};

const Form: React.FC<FormProps> = ({
  formTitle,
  primaryButton,
  secondaryButton,
  onPrimaryClick,
  onSecondaryClick,
  width,
  onSubmit,
  fields,
}) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const handleFieldChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
    const field = fields.find(f => f.name === name);
    if (field?.onChange) {
      field.onChange(value);
    }
  };

  const getFieldColSpan = (field: BaseField) => {
    // Full width for textarea and subtitle
    if (field.type === "textarea" || field.type === "subtitle") {
      return "col-span-full";
    }
    // Use custom colSpan if provided
    if (field.colSpan) {
      return `col-span-${field.colSpan}`;
    }
    // Default to single column
    return "";
  };

  return (
    <FormContainer
      formTitle={formTitle}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      onPrimaryClick={onPrimaryClick}
      onSecondaryClick={onSecondaryClick}
      width={width}
      onSubmit={onSubmit}
    >
      {fields.map((field, index) => {
        const colSpanClass = getFieldColSpan(field);

        // Render textarea for subtitle or textarea type
        if (field.type === "textarea" || field.type === "subtitle") {
          return (
            <div key={index} className={`w-full ${colSpanClass}`}>
              <TextArea
                label={field.label}
                placeholder={field.placeholder}
                value={formValues[field.name] || field.value || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
              />
            </div>
          );
        }

        // Render file input for image or file type
        if (field.type === "image" || field.type === "file") {
          return (
            <div key={index} className={`w-full ${colSpanClass}`}>
              <Input
                type="file"
                label={field.label}
                placeholder={field.placeholder || "Choose a file"}
                value={formValues[field.name] || field.value || ""}
                onChange={(value) => handleFieldChange(field.name, value)}
                required={field.required}
                validate={field.validate}
                errorMessage={field.errorMessage}
                prefix=""
                options={[]}
              />
            </div>
          );
        }

        // Render select input
        if (field.type === "select" && "options" in field) {
          return (
            <div key={index} className={`w-full ${colSpanClass}`}>
              <Input
                type="select"
                label={field.label}
                placeholder={field.placeholder}
                options={field.options}
                value={formValues[field.name] || field.value || ""}
                onChange={(value) => handleFieldChange(field.name, value)}
                required={field.required}
                validate={field.validate}
                errorMessage={field.errorMessage}
                prefix=""
              />
            </div>
          );
        }

        // Default input type
        return (
          <div key={index} className={`w-full ${colSpanClass}`}>
            <Input
              type={field.type || "text"}
              label={field.label}
              placeholder={field.placeholder}
              value={formValues[field.name] || field.value || ""}
              onChange={(value) => handleFieldChange(field.name, value)}
              required={field.required}
              validate={field.validate}
              errorMessage={field.errorMessage}
              prefix=""
              options={[]}
            />
          </div>
        );
      })}
    </FormContainer>
  );
};

export default Form;
