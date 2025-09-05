import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const [serverMsg, setServerMsg] = useState(null);

  const onSubmit = async (data) => {
    setServerMsg(null);
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("address", data.address);
    fd.append("city", data.city);
    fd.append("state", data.state);
    fd.append("contact", data.contact);
    fd.append("email_id", data.email_id);
    if (data.image?.[0]) fd.append("image", data.image[0]);

    try {
      const res = await fetch("/api/schools", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed");
      setServerMsg({ type: "success", text: "School added successfully!" });
      reset();
    } catch (e) {
      setServerMsg({ type: "error", text: e.message || "Something went wrong" });
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Add School</h1>

        {serverMsg && (
          <div style={{ marginBottom: 12, padding: 12, borderRadius: 8, background: serverMsg.type === "success" ? "#ecfdf5" : "#fff1f2", color: serverMsg.type === "success" ? "#065f46" : "#7f1d1d" }}>
            {serverMsg.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ background: "#fff", padding: 18, borderRadius: 12 }}>
          <div style={{ marginBottom: 12 }}>
            <label>School Name</label><br />
            <input style={{ width: "100%", padding: 8 }} {...register("name", { required: "Name is required" })} />
            {errors.name && <div style={{ color: "red" }}>{errors.name.message}</div>}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Address</label><br />
            <textarea rows={3} style={{ width: "100%", padding: 8 }} {...register("address", { required: "Address is required" })} />
            {errors.address && <div style={{ color: "red" }}>{errors.address.message}</div>}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label>City</label><br />
              <input style={{ width: "100%", padding: 8 }} {...register("city", { required: "City is required" })} />
              {errors.city && <div style={{ color: "red" }}>{errors.city.message}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <label>State</label><br />
              <input style={{ width: "100%", padding: 8 }} {...register("state", { required: "State is required" })} />
              {errors.state && <div style={{ color: "red" }}>{errors.state.message}</div>}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label>Contact Number</label><br />
              <input style={{ width: "100%", padding: 8 }} {...register("contact", { required: "Contact is required", pattern: { value: /^[0-9+\-\s]{7,20}$/, message: "Enter a valid contact number" } })} />
              {errors.contact && <div style={{ color: "red" }}>{errors.contact.message}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <label>Email</label><br />
              <input style={{ width: "100%", padding: 8 }} type="email" {...register("email_id", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })} />
              {errors.email_id && <div style={{ color: "red" }}>{errors.email_id.message}</div>}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>School Image</label><br />
            <input type="file" accept="image/*" {...register("image", { required: "Image is required" })} />
            {errors.image && <div style={{ color: "red" }}>{errors.image.message}</div>}
          </div>

          <button type="submit" disabled={isSubmitting} style={{ padding: "10px 18px", background: "#000", color: "#fff", borderRadius: 8 }}>
            {isSubmitting ? "Saving..." : "Save School"}
          </button>
        </form>
      </div>
    </main>
  );
}
