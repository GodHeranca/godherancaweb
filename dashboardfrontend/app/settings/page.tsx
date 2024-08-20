"use client";
import React, { useState } from "react";
import Heading from "../components/Heading";
import { useTranslation } from "react-i18next";
import { useLogin } from "../context/LoginContext"; // Import your useLogin hook

type UserSetting = {
    label: string;
    value: string | boolean;
    type: "text" | "toggle" | "password";
};

const mockSettings: UserSetting[] = [
    { label: "notification", value: true, type: "toggle" },
    { label: "darkMode", value: false, type: "toggle" },
    { label: "password", value: '', type: "password" },
];

const Settings = () => {
    const { t, i18n } = useTranslation();
    const { updatePassword } = useLogin(); // Destructure the updatePassword function
    const [userSettings, setUserSettings] = useState<UserSetting[]>(mockSettings);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

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

    const handleSave = async () => {
        setSaveStatus(t('saving'));
        setPasswordError(null);

        // Handle password update
        const passwordSetting = userSettings.find(setting => setting.label === "password");
        if (passwordSetting && passwordSetting.value) {
            try {
                await updatePassword(passwordSetting.value as string);
                setSaveStatus(t('saved'));
            } catch (error) {
                setPasswordError(t('passwordUpdateError'));
                setSaveStatus(null);
            }
        } else {
            setTimeout(() => {
                setSaveStatus(t('saved'));
            }, 1000);
        }
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = event.target.value;
        i18n.changeLanguage(selectedLanguage);

        const settingsCopy = [...userSettings];
        const languageSetting = settingsCopy.find(setting => setting.label === "language");
        if (languageSetting) {
            languageSetting.value = selectedLanguage;
            setUserSettings(settingsCopy);
        }
    };

    return (
        <div className="w-full px-4 py-6 sm:px-6 md:px-8 lg:px-10">
            <Heading name={t('userSettings')} />
            <div className="overflow-x-auto mt-5 shadow-md rounded-lg">
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
                                <td className="py-2 px-4 font-medium uppercase">
                                    {t(setting.label)}
                                </td>
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
                                    ) : setting.type === "password" ? (
                                        <label className="inline-flex relative items-center cursor-pointer">
                                            <input
                                                type="password"
                                                className="w-full px-4 py-2 border rounded-lg text-gray-500 focus:outline-none focus:border-gray-500"
                                                placeholder={t('Enter New Password')}
                                                onChange={(e) => handleTextChange(index, e.target.value)}
                                            />
                                        </label>
                                    ) : (
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-lg text-gray-500 focus:outline-none focus:border-gray-500"
                                            value={setting.label === "language" ? t(setting.value as string) : (setting.value as string)}
                                            onChange={(e) => handleTextChange(index, e.target.value)}
                                            disabled={setting.label === "language"}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <select
                    className="border rounded-lg p-2 uppercase"
                    value={i18n.language}
                    onChange={handleLanguageChange}
                >
                    <option value="en">{t('english')}</option>
                    <option value="es">{t('spanish')}</option>
                    <option value="pt">{t('portuguese')}</option>
                </select>
                <button
                    className="bg-black-300 hover:bg-black-500 text-white font-bold py-2 px-4 rounded w-full md:w-auto"
                    onClick={handleSave}
                >
                    {t('saveChanges')}
                </button>
                {saveStatus && (
                    <p className={`mt-2 ${saveStatus.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
                        {saveStatus}
                    </p>
                )}
                {passwordError && (
                    <p className="text-red-500 mt-2">{passwordError}</p>
                )}
            </div>
        </div>
    );
};

export default Settings;
