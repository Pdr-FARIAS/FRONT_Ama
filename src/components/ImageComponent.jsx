
export function ResponsiveImage() {
    const imageUrl = "https://placehold.co/1600x900/a0aec0/ffffff?text=Imagem+Inspiradora+da+ONG";

    return (

        <div className="relative w-full h-96 bg-gray-200">
            <img
                src={imageUrl}
                alt="Imagem Inspiradora da ONG"

                className="absolute inset-0 w-full h-full object-cover"

            />
        </div>
    );
}


export function FixedSizeImage() {
    const imageUrl = "https://placehold.co/800x600/a0aec0/ffffff?text=Imagem+Pequena";

    return (

        <img
            src={imageUrl}
            alt="Imagem com tamanho fixo"
            width={800}
            height={600}
            className="w-full max-w-lg h-auto"
        />
    );
}

