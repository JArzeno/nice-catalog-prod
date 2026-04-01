import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useStore } from "../../lib/store";
import { toast } from "react-hot-toast";
import type { Database } from "../../types/supabase";

type Catalog = Database["public"]["Tables"]["catalogs"]["Row"];

const schema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    description: z.string().max(500, "Description is too long").nullable(),
    contact_button_label: z.string().max(50, "Label is too long").nullable(),
    contact_button_url: z
        .string()
        .url("Must be a valid URL")
        .max(500, "URL is too long")
        .nullable()
        .or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

interface Props {
    catalog: Catalog;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CatalogEditModal({
    catalog,
    onClose,
    onSuccess,
}: Props) {
    const updateCatalog = useStore((state) => state.updateCatalog);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: catalog.name,
            description: catalog.description || "",
            contact_button_label: catalog.contact_button_label || "",
            contact_button_url: catalog.contact_button_url || "",
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await updateCatalog(catalog.id, {
                ...data,
                contact_button_label: data.contact_button_label || null,
                contact_button_url: data.contact_button_url || null,
            });
            toast.success("Catalog updated successfully");
            onSuccess();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || "Failed to update catalog");
            } else {
                toast.error("Failed to update catalog");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Edit Catalog</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            {...register("name")}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ed1c24] focus:ring-[#ed1c24] sm:text-sm px-4 py-3 border"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            {...register("description")}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ed1c24] focus:ring-[#ed1c24] sm:text-sm px-4 py-3 border"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                            Contact Button{" "}
                            <span className="text-gray-400 font-normal">
                                (optional)
                            </span>
                        </p>
                        <div className="space-y-3">
                            <div>
                                <label
                                    htmlFor="contact_button_label"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Button Label
                                </label>
                                <input
                                    type="text"
                                    id="contact_button_label"
                                    {...register("contact_button_label")}
                                    placeholder="e.g. Book Appointment, Contact Us, Call Us"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ed1c24] focus:ring-[#ed1c24] sm:text-sm px-4 py-3 border"
                                />
                                {errors.contact_button_label && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.contact_button_label.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="contact_button_url"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Button URL
                                </label>
                                <input
                                    type="url"
                                    id="contact_button_url"
                                    {...register("contact_button_url")}
                                    placeholder="https://..."
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ed1c24] focus:ring-[#ed1c24] sm:text-sm px-4 py-3 border"
                                />
                                {errors.contact_button_url && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.contact_button_url.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ed1c24] hover:bg-[#d91920] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24] disabled:opacity-50"
                        >
                            {isSubmitting && (
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            )}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
