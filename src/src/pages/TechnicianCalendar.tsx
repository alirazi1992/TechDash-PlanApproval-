import React, { useMemo, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { AppShell } from "../components/layout/AppShell";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";

const tabs: { id: "general" | "technical" | "team"; label: string }[] = [
  { id: "general", label: "عمومی" },
  { id: "technical", label: "تقویم فنی" },
  { id: "team", label: "تقویم تیمی" },
];

const todayJalali = new DateObject({ calendar: persian, locale: persian_fa });

const initialTeamDate = "1403/09/24";

const initialEvents = [
  {
    id: "ev-1",
    title: "بازدید میدانی مشترک غرب تهران",
    time: "15:00",
    date: initialTeamDate,
    channel: "UTM-32",
    description: "تامین نیروی پشتیبان",
  },
  {
    id: "ev-2",
    title: "همراستا سازی پروژه شمال شرق",
    time: "17:00",
    date: initialTeamDate,
    channel: "شمال شرق",
    description: "پلتفرم هماهنگی جدید",
  },
];

function toDateObject(date: string | null) {
  if (!date) return null;
  return new DateObject({ calendar: persian, locale: persian_fa, date });
}

function formatJalali(date: string | null) {
  const obj = toDateObject(date);
  return obj ? obj.format("dddd D MMMM YYYY") : "انتخاب تاریخ";
}

function TechnicianCalendarPage() {
  const [activeTab, setActiveTab] = useState<"general" | "technical" | "team">("team");
  const [events, setEvents] = useState(initialEvents);
  const [selectedDate, setSelectedDate] = useState<string>(initialTeamDate);
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [form, setForm] = useState({
    title: "",
    date: initialTeamDate,
    time: "08:00",
    channel: "UTM-32",
    description: "",
  });

  const dayKey = useMemo(() => form.date || selectedDate || todayJalali.format("YYYY/MM/DD"), [form.date, selectedDate]);

  const dayEvents = useMemo(
    () =>
      events.filter((item) => {
        const sameDay = item.date === dayKey;
        const sameChannel = channelFilter === "all" || item.channel === channelFilter;
        return sameDay && sameChannel;
      }),
    [events, dayKey, channelFilter]
  );

  const handleSubmit = () => {
    if (!form.title.trim() || !form.date) {
      window.alert("عنوان و تاریخ رویداد را وارد کنید.");
      return;
    }

    const newEvent = {
      id: `ev-${events.length + 1}`,
      title: form.title,
      time: form.time || "00:00",
      date: form.date,
      channel: form.channel,
      description: form.description,
    };

    setEvents((prev) => [...prev, newEvent]);
    setSelectedDate(form.date);
    setForm((prev) => ({ ...prev, title: "", description: "" }));
  };

  const renderTabs = () => (
    <div className="flex items-center gap-2 flex-row justify-end" dir="rtl">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "primary" : "ghost"}
          className="text-sm px-4"
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );

  const renderGeneral = () => (
    <Card className="p-6 border border-gray-100 bg-white" dir="rtl">
      <h2 className="text-xl font-bold text-gray-900 mb-2">نمای عمومی</h2>
      <p className="text-gray-600">برای مشاهده جزئیات، روی تب‌های تقویم فنی یا تقویم تیمی کلیک کنید.</p>
    </Card>
  );

  const renderTechnical = () => (
    <Card className="p-6 border border-gray-100 bg-white" dir="rtl">
      <div className="flex items-center justify-between mb-4 flex-row">
        <div>
          <p className="text-sm text-gray-500">تقویم فنی</p>
          <h2 className="text-xl font-bold text-gray-900">هماهنگی فنی به تفکیک روز</h2>
        </div>
        <Button variant="secondary" onClick={() => window.alert("تقویم فنی به‌روز شد")}>به‌روزرسانی</Button>
      </div>
      <p className="text-gray-600">این بخش برای هماهنگی فنی استفاده می‌شود. مشابه تقویم تیمی است و رویدادهای شما را با تاریخ شمسی نمایش می‌دهد.</p>
    </Card>
  );

  const renderTeamCalendar = () => (
    <div className="grid gap-4 md:grid-cols-2" dir="rtl">
      <Card className="p-6 border border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-4 flex-row">
          <div className="flex items-center gap-2 flex-row">
            <span className="w-10 h-10 inline-flex items-center justify-center bg-amber-50 text-amber-600 rounded-full">
              <Icon name="calendar" size={20} />
            </span>
            <div>
              <p className="text-sm text-amber-600">فرم رویداد تقویم تیمی (شمسی)</p>
              <h3 className="font-bold text-gray-900">ثبت و هماهنگی با تیم</h3>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-gray-600">عنوان رویداد</label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-right"
              placeholder="مثلاً بازدید میدانی مشترک"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="grid gap-3 grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-gray-600">تاریخ شمسی</label>
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                value={toDateObject(form.date) as any}
                format="YYYY/MM/DD"
                containerClassName="w-full"
                className="w-full"
                inputClass="w-full rounded-lg border border-gray-200 px-3 py-2 text-right"
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    date: (value as DateObject)?.format("YYYY/MM/DD") ?? prev.date,
                  }))
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-600">زمان</label>
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-right"
                value={form.time}
                onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-3 grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-gray-600">کانال</label>
              <select
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-right"
                value={form.channel}
                onChange={(e) => setForm((prev) => ({ ...prev, channel: e.target.value }))}
              >
                <option value="UTM-32">UTM-32</option>
                <option value="شمال شرق">شمال شرق</option>
                <option value="غرب تهران">غرب تهران</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-600">توضیحات</label>
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-right"
                placeholder="یادداشت تکمیلی"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            ثبت رویداد و هماهنگی
          </Button>
        </div>
      </Card>

      <Card className="p-6 border border-gray-100 bg-white">
        <div className="flex items-center justify-between flex-row mb-3">
          <div>
            <p className="text-sm text-gray-500">تقویم تیمی</p>
            <h3 className="font-bold text-gray-900">{formatJalali(dayKey)}</h3>
          </div>
          <div className="flex items-center gap-2 flex-row">
            <select
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-right"
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
            >
              <option value="all">همه کانال‌ها</option>
              <option value="UTM-32">UTM-32</option>
              <option value="شمال شرق">شمال شرق</option>
              <option value="غرب تهران">غرب تهران</option>
            </select>
            <Button variant="secondary" onClick={() => setSelectedDate(dayKey)}>به روز رسانی</Button>
          </div>
        </div>

        <div className="space-y-3">
          {dayEvents.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-gray-500">
              رویدادی برای این روز ثبت نشده است.
            </div>
          )}

          {dayEvents.map((item) => (
            <div key={item.id} className="flex items-start gap-3 flex-row">
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-700 font-semibold">{item.time}</span>
                <span className="w-px h-12 bg-gray-200" aria-hidden />
              </div>
              <div className="flex-1 bg-gray-50 border border-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between flex-row">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <span className="text-xs text-gray-500">{item.channel}</span>
                </div>
                {item.description && <p className="text-sm text-gray-700 mt-1">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6" dir="rtl">
        <div className="flex items-center justify-between flex-row">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">داشبورد عملیات میدانی</h1>
            <p className="text-gray-600 text-sm">هماهنگی رویدادها و تیم‌ها در یک صفحه</p>
          </div>
          <Button onClick={() => (window.location.href = "/")}>بازگشت به خانه</Button>
        </div>

        {renderTabs()}

        {activeTab === "general" && renderGeneral()}
        {activeTab === "technical" && renderTechnical()}
        {activeTab === "team" && renderTeamCalendar()}
      </div>
    </AppShell>
  );
}

export default TechnicianCalendarPage;
export { TechnicianCalendarPage as TechnicianCalendar };
