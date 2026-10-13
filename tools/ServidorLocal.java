import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.SimpleFileServer;

import java.net.InetSocketAddress;
import java.nio.file.Path;

/** Servidor HTTP local opcional, compatível com Java 21 (não é usado no GitHub Pages). */
public class ServidorLocal {
    public static void main(String[] args) throws Exception {
        int porta = args.length > 0 ? Integer.parseInt(args[0]) : 8080;
        Path raiz = Path.of(".").toAbsolutePath().normalize();
        HttpServer servidor = SimpleFileServer.createFileServer(
                new InetSocketAddress("127.0.0.1", porta),
                raiz,
                SimpleFileServer.OutputLevel.INFO
        );
        servidor.start();
        System.out.println("Servidor iniciado: http://localhost:" + porta);
    }
}
