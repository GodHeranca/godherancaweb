"use client";
import React, { useState } from "react";
import Heading from "@/components/Heading";
import { useTranslation } from "react-i18next";

type UserSetting = {
    label: string;
    value: string | boolean;
    type: "text" | "toggle";
};

const mockSettings: UserSetting[] = [
    { label: "username", value: "john_doe", type: "text" },
    { label: "email", value: "john.doe@example.com", type: "text" },
    { label: "notification", value: true, type: "toggle" },
    { label: "darkMode", value: false, type: "toggle" },
    // { label: "language", value: "en", type: "text" },
];

const Settings = () => {
    const { t, i18n } = useTranslation();
    const [userSettings, setUserSettings] = useState<UserSetting[]>(mockSettings);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);

    const handleToggleChange = (index: number) => {
        const settingsCopy = [...userSettings];
        settingsCopy[index].value = !settingsCopy[index].value as boolean;
        setUserSettings(settingsCopy);
    };

    const handleTextChange = (index: number, value: string) => {
        const settingsCopy = [...userSettings];
        settingsCopy[index].value = value;
        setUserSettings(settingsCopy);
    };

    const handleSave = () => {
        // Simulate saving data (e.g., to a backend)
        setSaveStatus(t('saving'));
        setTimeout(() => {
            setSaveStatus(t('saved'));
        }, 1000);
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = event.target.value;
        i18n.changeLanguage(selectedLanguage);

        // Update the language setting in the state
        const settingsCopy = [...userSettings];
        const languageSetting = settingsCopy.find(setting => setting.label === "language");
        if (languageSetting) {
            languageSetting.value = selectedLanguage;
            setUserSettings(settingsCopy);
        }
    };

    return (
        <div className="w-full">
            <Heading name={t('userSettings')} />
            <div className="overflow-x-auto mt-5 shadow-md">
                <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                                {t('setting')}
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                                {t('value')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {userSettings.map((setting, index) => (
                            <tr className="hover:bg-gray-100" key={setting.label}>
                                <td className="py-2 px-4">{t(setting.label)}</td>
                                <td className="py-2 px-4">
                                    {setting.type === "toggle" ? (
                                        <label className="inline-flex relative items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={setting.value as boolean}
                                                onChange={() => handleToggleChange(index)}
                                            />
                                            <div
                                                className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-black-300 peer-focus:ring-4 
                                                transition peer-checked:after:translate-x-full peer-checked:after:border-white 
                                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                                                after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                                peer-checked:bg-black-300"
                                            ></div>
                                        </label>
                                    ) : (
                                        <input
                                            type="text"
                                            className="px-4 py-2 border rounded-lg text-gray-500 focus:outline-none focus:border-gray-500"
                                            value={setting.label === "language" ? t(setting.value as string) : (setting.value as string)}
                                            onChange={(e) => handleTextChange(index, e.target.value)}
                                            disabled={setting.label === "language"} // Disable input for language setting
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <select
                    className="border rounded-lg p-2"
                    value={i18n.language}
                    onChange={handleLanguageChange}
                >
                    <option value="en">{t('english')}</option>
                    <option value="es">{t('spanish')}</option>
                    <option value="pt">{t('portuguese')}</option>
                </select>
                <button
                    className="bg-gray-500 hover:bg-black-300 text-white font-bold py-2 px-4 rounded"
                    onClick={handleSave}
                >
                    {t('saveChanges')}
                </button>
                {saveStatus && (
                    <p className={`mt-2 ${saveStatus.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
                        {saveStatus}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Settings;
