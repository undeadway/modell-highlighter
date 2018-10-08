public class Test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {

		long l1 = 1l;
		Long long1 = new Long(1);
		
		long l2 = 100000l;
		Long long2 = new Long(100000l);

		System.out.println(l1 == long1);
		System.out.println(l2 == long2);
		
		
		Double h=3d;
		Double k=new Double(3);

		int i=3;
		double d = 3.0;

		System.out.println(h==k);
		System.out.println(h==i);
		System.out.println(k==i); 
		System.out.println(d==i); 
	}
}