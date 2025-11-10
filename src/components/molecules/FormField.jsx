import Label from "@/components/atoms/Label";

const FormField = ({ 
  label, 
  children, 
  error, 
  required = false, 
  className = "" 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;